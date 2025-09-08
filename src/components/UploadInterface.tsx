import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Video, FileImage, Download } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UploadInterface = () => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [albumData, setAlbumData] = useState<any>(null);
  const { toast } = useToast();

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);
    
    try {
      // Create preview URL
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideo(videoUrl);
      
      toast({
        title: "Video loaded successfully!",
        description: "Ready to generate album page.",
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const generateAlbumPage = async () => {
    if (!uploadedFile) return;
    
    setIsGenerating(true);
    
    try {
      // Upload video to storage
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Generate AR target image
      const arTargetImageUrl = await generateARTargetImage(fileName);

      // Create album
      const { data: albumResult, error: albumError } = await supabase
        .from('albums')
        .insert([
          { name: 'School Memories Album' }
        ])
        .select()
        .single();

      if (albumError) throw albumError;

      // Create album page with AR target
      const { data: pageResult, error: pageError } = await supabase
        .from('album_pages')
        .insert([
          {
            album_id: albumResult.id,
            page_no: 1,
            video_url: urlData.publicUrl,
            ar_target_image_url: arTargetImageUrl,
            ar_target_width_mm: 210,
            ar_target_height_mm: 297,
            overlay_json: {
              title: "Annual Day 2025",
              event: "Class 5 Performance",
              student_name: ""
            }
          }
        ])
        .select()
        .single();

      if (pageError) throw pageError;

      setAlbumData({ album: albumResult, page: pageResult });
      
      toast({
        title: "Album page generated!",
        description: "Ready for printing and AR scanning.",
      });
      
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateARTargetImage = async (videoFileName: string): Promise<string> => {
    if (!uploadedFile) return '';
    
    // Extract first frame from video to use as AR target
    const video = document.createElement('video');
    video.src = URL.createObjectURL(uploadedFile);
    
    return new Promise((resolve) => {
      video.addEventListener('loadeddata', () => {
        // Set video to first frame
        video.currentTime = 0.5; // 0.5 seconds in to avoid black frame
        
        video.addEventListener('seeked', async () => {
          // Create canvas to capture frame
          const canvas = document.createElement('canvas');
          canvas.width = 512; // Standard AR target size
          canvas.height = 512;
          const ctx = canvas.getContext('2d')!;
          
          // Draw video frame to canvas, maintaining aspect ratio
          const videoAspect = video.videoWidth / video.videoHeight;
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (videoAspect > 1) {
            // Video is wider than square
            drawHeight = canvas.width / videoAspect;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            // Video is taller than square
            drawWidth = canvas.height * videoAspect;
            offsetX = (canvas.width - drawWidth) / 2;
          }
          
          // Fill background with white
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw video frame
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
          
          // Add tracking markers for better AR detection
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, 20, 20); // Top-left
          ctx.fillRect(canvas.width - 20, 0, 20, 20); // Top-right
          ctx.fillRect(0, canvas.height - 20, 20, 20); // Bottom-left
          ctx.fillRect(canvas.width - 20, canvas.height - 20, 20, 20); // Bottom-right
          
          // Convert to blob and upload
          canvas.toBlob(async (blob) => {
            if (!blob) {
              resolve('');
              return;
            }
            
            const targetFileName = `ar-target-${Date.now()}.jpg`;
            const { data, error } = await supabase.storage
              .from('videos')
              .upload(targetFileName, blob);
              
            if (error) {
              console.error('Error uploading AR target:', error);
              resolve('');
              return;
            }
            
            const { data: urlData } = supabase.storage
              .from('videos')
              .getPublicUrl(targetFileName);
              
            resolve(urlData.publicUrl);
          }, 'image/jpeg', 0.9);
          
          // Cleanup
          URL.revokeObjectURL(video.src);
        }, { once: true });
      }, { once: true });
      
      video.load();
    });
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Create Your First Album
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a video, generate a styled album page, and see how the AR magic works
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Upload Section */}
          <Card className="p-8 shadow-medium">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Video className="w-6 h-6 text-primary" />
              Step 1: Upload Video
            </h3>
            
            {!uploadedVideo ? (
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg mb-4">Drop your video file here</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <Button asChild variant="premium" size="lg">
                  <label htmlFor="video-upload" className="cursor-pointer">
                    Choose Video File
                  </label>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <video 
                  src={uploadedVideo} 
                  controls 
                  className="w-full rounded-lg shadow-soft"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={generateAlbumPage}
                    disabled={isGenerating}
                    variant="hero" 
                    size="lg"
                    className="flex-1"
                  >
                    {isGenerating ? "Generating..." : "Generate Album Page"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUploadedVideo(null);
                      setUploadedFile(null);
                      setAlbumData(null);
                    }}
                  >
                    Upload New Video
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Album Generation Section */}
          <Card className="p-8 shadow-medium">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <FileImage className="w-6 h-6 text-accent" />
              Step 2: Album Page Preview
            </h3>
            
            {!albumData ? (
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                <div className="text-center">
                  <FileImage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Upload a video to generate album page
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Album Page Preview */}
                <div className="bg-white p-6 rounded-lg shadow-soft border-2 border-secondary/20">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">{albumData.page?.overlay_json?.title || "Annual Day 2025"}</p>
                      <p className="text-xs text-muted-foreground">{albumData.page?.overlay_json?.event || "Class 5 Performance"}</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-center mb-2">{albumData.album?.name || "School Memories Album"}</h4>
                  <p className="text-xs text-center text-muted-foreground">
                    Scan this page with the Memories app to watch the video!
                  </p>
                </div>
                
                <Button variant="premium" size="lg" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Print-Ready PDF
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Next Steps */}
        {albumData && (
          <div className="mt-12 text-center">
            <Card className="p-8 max-w-3xl mx-auto shadow-medium bg-gradient-secondary/10">
              <h3 className="text-2xl font-semibold mb-4">Ready for AR Magic! 🎉</h3>
              <p className="text-lg mb-6">
                Your album page is ready. Print it out and scan with the Memories mobile app to see the video play with audio and overlays.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  Try Mobile App Demo
                </Button>
                <Button variant="outline" size="lg">
                  Learn About Printing
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadInterface;