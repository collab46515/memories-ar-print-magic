import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Video, FileImage, Download } from "lucide-react";
import { useState } from "react";

const UploadInterface = () => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [albumGenerated, setAlbumGenerated] = useState(false);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a temporary URL for preview
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideo(videoUrl);
    }
  };

  const generateAlbumPage = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setAlbumGenerated(true);
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
                      setAlbumGenerated(false);
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
            
            {!albumGenerated ? (
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
                {/* Mock Album Page Preview */}
                <div className="bg-white p-6 rounded-lg shadow-soft border-2 border-secondary/20">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">Annual Day 2025</p>
                      <p className="text-xs text-muted-foreground">Class 5 Performance</p>
                    </div>
                  </div>
                  <h4 className="font-semibold text-center mb-2">School Memories Album</h4>
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
        {albumGenerated && (
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