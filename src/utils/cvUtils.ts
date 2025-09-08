// Computer Vision utilities for AR detection
declare const cv: any;

export interface MatchResult {
  confidence: number;
  homography: number[][] | null;
  inliers: number;
  corners: { x: number; y: number }[];
}

export class ARDetector {
  private orb: any;
  private matcher: any;
  private targetDescriptors: Map<string, any> = new Map();
  private targetKeypoints: Map<string, any> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    // Wait for OpenCV to load
    await this.waitForOpenCV();
    
    // Initialize ORB detector
    this.orb = new cv.ORB(500, 1.2, 8, 31, 0, 2, cv.ORB_HARRIS_SCORE, 31, 20);
    this.matcher = new cv.BFMatcher(cv.NORM_HAMMING, true);
    
    this.isInitialized = true;
    console.log('AR Detector initialized with ORB');
  }

  private waitForOpenCV(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof cv !== 'undefined' && cv.Mat) {
        resolve();
      } else {
        const checkCV = () => {
          if (typeof cv !== 'undefined' && cv.Mat) {
            resolve();
          } else {
            setTimeout(checkCV, 100);
          }
        };
        checkCV();
      }
    });
  }

  async addTarget(targetId: string, imageElement: HTMLImageElement) {
    if (!this.isInitialized) await this.initialize();

    // Convert image to OpenCV Mat
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imageElement, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const mat = cv.matFromImageData(imgData);
    const gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

    // Detect ORB keypoints and descriptors
    const keypoints = new cv.KeyPointVector();
    const descriptors = new cv.Mat();
    
    this.orb.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);
    
    // Store for later matching
    this.targetKeypoints.set(targetId, keypoints);
    this.targetDescriptors.set(targetId, descriptors);
    
    console.log(`Target ${targetId} added with ${keypoints.size()} keypoints`);
    
    // Cleanup
    mat.delete();
    gray.delete();
  }

  async detectTarget(videoFrame: HTMLVideoElement | HTMLCanvasElement): Promise<Map<string, MatchResult>> {
    if (!this.isInitialized) await this.initialize();

    const results = new Map<string, MatchResult>();
    
    // Convert frame to OpenCV Mat
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    if (videoFrame instanceof HTMLVideoElement) {
      canvas.width = videoFrame.videoWidth;
      canvas.height = videoFrame.videoHeight;
      ctx.drawImage(videoFrame, 0, 0);
    } else {
      canvas.width = videoFrame.width;
      canvas.height = videoFrame.height;
      ctx.drawImage(videoFrame, 0, 0);
    }
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const mat = cv.matFromImageData(imgData);
    const gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

    // Detect keypoints in current frame
    const frameKeypoints = new cv.KeyPointVector();
    const frameDescriptors = new cv.Mat();
    this.orb.detectAndCompute(gray, new cv.Mat(), frameKeypoints, frameDescriptors);

    // Match against each target
    for (const [targetId, targetDescriptors] of this.targetDescriptors.entries()) {
      const matches = new cv.DMatchVector();
      
      if (frameDescriptors.rows > 0 && targetDescriptors.rows > 0) {
        this.matcher.match(frameDescriptors, targetDescriptors, matches);
        
        // Filter good matches (Lowe's ratio test approximation)
        const goodMatches = [];
        for (let i = 0; i < matches.size(); i++) {
          const match = matches.get(i);
          if (match.distance < 50) { // Threshold for good matches
            goodMatches.push(match);
          }
        }

        if (goodMatches.length >= 10) {
          // Extract matched points
          const srcPoints = [];
          const dstPoints = [];
          const targetKeypoints = this.targetKeypoints.get(targetId);
          
          for (const match of goodMatches) {
            const frameKp = frameKeypoints.get(match.queryIdx);
            const targetKp = targetKeypoints.get(match.trainIdx);
            
            srcPoints.push(frameKp.pt.x, frameKp.pt.y);
            dstPoints.push(targetKp.pt.x, targetKp.pt.y);
          }

          // Find homography using RANSAC
          const srcMat = cv.matFromArray(goodMatches.length, 1, cv.CV_32FC2, srcPoints);
          const dstMat = cv.matFromArray(goodMatches.length, 1, cv.CV_32FC2, dstPoints);
          const mask = new cv.Mat();
          
          const homography = cv.findHomography(srcMat, dstMat, cv.RANSAC, 5.0, mask);
          
          // Count inliers
          let inliers = 0;
          for (let i = 0; i < mask.rows; i++) {
            if (mask.ucharPtr(i, 0)[0] === 1) {
              inliers++;
            }
          }
          
          // Calculate confidence based on inliers ratio
          const confidence = inliers / goodMatches.length;
          
          // Extract corners if homography is valid
          let corners: { x: number; y: number }[] = [];
          if (confidence > 0.3 && homography.rows === 3) {
            // Get target image corners (assuming 512x512 target)
            const targetCorners = [
              [0, 0], [512, 0], [512, 512], [0, 512]
            ];
            
            corners = targetCorners.map(([x, y]) => {
              const point = new cv.Mat(3, 1, cv.CV_64F);
              point.doublePtr(0, 0)[0] = x;
              point.doublePtr(1, 0)[0] = y;
              point.doublePtr(2, 0)[0] = 1;
              
              const transformed = new cv.Mat();
              cv.gemm(homography, point, 1, new cv.Mat(), 0, transformed);
              
              const w = transformed.doublePtr(2, 0)[0];
              const transformedX = transformed.doublePtr(0, 0)[0] / w;
              const transformedY = transformed.doublePtr(1, 0)[0] / w;
              
              point.delete();
              transformed.delete();
              
              return { x: transformedX, y: transformedY };
            });
          }

          results.set(targetId, {
            confidence,
            homography: homography.rows === 3 ? this.matToArray(homography) : null,
            inliers,
            corners
          });
          
          // Cleanup
          srcMat.delete();
          dstMat.delete();
          mask.delete();
          if (homography.rows === 3) homography.delete();
        }
      }
      
      matches.delete();
    }

    // Cleanup
    mat.delete();
    gray.delete();
    frameKeypoints.delete();
    frameDescriptors.delete();

    return results;
  }

  private matToArray(mat: any): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < mat.rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < mat.cols; j++) {
        row.push(mat.doublePtr(i, j)[0]);
      }
      result.push(row);
    }
    return result;
  }

  cleanup() {
    if (this.orb) this.orb.delete();
    if (this.matcher) this.matcher.delete();
    
    for (const keypoints of this.targetKeypoints.values()) {
      keypoints.delete();
    }
    
    for (const descriptors of this.targetDescriptors.values()) {
      descriptors.delete();
    }
    
    this.targetKeypoints.clear();
    this.targetDescriptors.clear();
    this.isInitialized = false;
  }
}