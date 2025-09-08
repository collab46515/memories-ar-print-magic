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
    
    // Extract frame from video for AR target
    const video = document.createElement('video');
    video.src = URL.createObjectURL(uploadedFile);
    video.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
      video.addEventListener('loadeddata', () => {
        // Seek to 1 second to avoid black frames
        video.currentTime = 1.0;
        
        video.addEventListener('seeked', async () => {
          // Create canvas for AR target (A4 proportions: 210x297mm ≈ 3:4.2)
          const canvas = document.createElement('canvas');
          canvas.width = 600; // Higher resolution for better tracking
          canvas.height = 848; // A4 ratio scaled
          const ctx = canvas.getContext('2d')!;
          
          // White background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Calculate video placement (center, maintain aspect ratio)
          const videoAspect = video.videoWidth / video.videoHeight;
          const targetAspect = canvas.width / canvas.height;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (videoAspect > targetAspect) {
            // Video wider - fit to width with letterbox top/bottom
            drawWidth = canvas.width * 0.8; // 80% of canvas width
            drawHeight = drawWidth / videoAspect;
            offsetX = canvas.width * 0.1;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            // Video taller - fit to height with letterbox sides
            drawHeight = canvas.height * 0.6; // 60% of canvas height
            drawWidth = drawHeight * videoAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = canvas.height * 0.15; // 15% from top
          }
          
          // Draw video frame
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
          
          // Add high-contrast AR tracking markers for better detection
          const markerSize = 30;
          const borderWidth = 5;
          
          // Corner markers - black squares with white borders for high contrast
          const corners = [
            [borderWidth, borderWidth], // Top-left
            [canvas.width - markerSize - borderWidth, borderWidth], // Top-right
            [borderWidth, canvas.height - markerSize - borderWidth], // Bottom-left
            [canvas.width - markerSize - borderWidth, canvas.height - markerSize - borderWidth] // Bottom-right
          ];
          
          corners.forEach(([x, y]) => {
            // White border
            ctx.fillStyle = 'white';
            ctx.fillRect(x - 2, y - 2, markerSize + 4, markerSize + 4);
            // Black marker
            ctx.fillStyle = 'black';
            ctx.fillRect(x, y, markerSize, markerSize);
            // White center dot for ORB detection
            ctx.fillStyle = 'white';
            ctx.fillRect(x + markerSize/2 - 3, y + markerSize/2 - 3, 6, 6);
          });
          
          // Add text overlay for better tracking features
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('MEMORIES AR TARGET', canvas.width / 2, canvas.height - 80);
          
          ctx.font = '24px Arial';
          ctx.fillText('Scan with camera to play video', canvas.width / 2, canvas.height - 45);
          
          // Add unique pattern based on video for identification
          const hash = videoFileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          ctx.font = '16px Arial';
          ctx.fillText(`ID: ${hash.toString(16).toUpperCase()}`, canvas.width / 2, canvas.height - 15);
          
          // Convert to blob and upload
          canvas.toBlob(async (blob) => {
            if (!blob) {
              resolve('');
              return;
            }
            
            const targetFileName = `ar-target-${Date.now()}.png`;
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
          }, 'image/png', 1.0);
          
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
                {/* Album Page Preview with Download */}
                <div className="bg-white p-6 rounded-lg shadow-soft border-2 border-secondary/20">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center relative">
                    {albumData.page?.ar_target_image_url ? (
                      <img 
                        src={albumData.page.ar_target_image_url}
                        alt="AR Target" 
                        className="w-full h-full object-contain rounded"
                        onError={(e) => {
                          console.error('Image failed to load:', albumData.page.ar_target_image_url);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', albumData.page.ar_target_image_url);
                        }}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="text-center">
                        <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{albumData.page?.overlay_json?.title || "Annual Day 2025"}</p>
                        <p className="text-xs text-muted-foreground">{albumData.page?.overlay_json?.event || "Class 5 Performance"}</p>
                      </div>
                    )}
                    
                    {/* Fallback content when image fails to load */}
                    {albumData.page?.ar_target_image_url && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center text-center"
                        style={{ display: 'none' }}
                        id="image-fallback"
                      >
                        <div>
                          <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                          <p className="text-sm font-medium">AR Target Generated</p>
                          <p className="text-xs text-muted-foreground">Preview unavailable - download to view</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-center mb-2">{albumData.album?.name || "School Memories Album"}</h4>
                  <p className="text-xs text-center text-muted-foreground mb-4">
                    Scan this page with your phone's camera to watch the video!
                  </p>
                  
                  <div className="space-y-2">
                    <Button 
                      type="button"
                      variant="premium" 
                      size="lg" 
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (albumData.page?.ar_target_image_url) {
                          window.open(albumData.page.ar_target_image_url, '_blank');
                        }
                      }}
                      disabled={!albumData.page?.ar_target_image_url}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Open AR Target (Full Size)
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (albumData.page?.ar_target_image_url) {
                            const link = document.createElement('a');
                            link.href = albumData.page.ar_target_image_url;
                            link.download = `ar-target-${Date.now()}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                      >
                        💾 Save PNG
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.print();
                        }}
                      >
                        🖨️ Print Page
                      </Button>
                    </div>
                  </div>
                </div>
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
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => window.open('/scanner', '_blank')}
                >
                  📱 Open AR Scanner
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    if (albumData.page?.ar_target_image_url) {
                      const link = document.createElement('a');
                      link.href = albumData.page.ar_target_image_url;
                      link.download = `ar-target-${Date.now()}.png`;
                      link.click();
                    }
                  }}
                >
                  💾 Download Target
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