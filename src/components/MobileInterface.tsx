import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, ScanLine, Download, Play, Zap } from "lucide-react";

const MobileInterface = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mobile AR Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Parents and students scan printed album pages to instantly watch videos with audio and personalized overlays
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Download App */}
          <Card className="p-6 text-center shadow-medium">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Download & Login</h3>
            <p className="text-muted-foreground mb-4">
              Enter your school code and download albums for offline AR scanning
            </p>
            <Button variant="outline" className="w-full">
              Get Memories App
            </Button>
          </Card>

          {/* Scan Process */}
          <Card className="p-6 text-center shadow-medium">
            <div className="w-16 h-16 bg-gradient-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <ScanLine className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Scan Album Page</h3>
            <p className="text-muted-foreground mb-4">
              Point camera at any printed page - AR locks within 1 second
            </p>
            <Button variant="outline" className="w-full">
              Try Demo Scan
            </Button>
          </Card>

          {/* Watch Video */}
          <Card className="p-6 text-center shadow-medium">
            <div className="w-16 h-16 bg-gradient-hero rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Watch & Listen</h3>
            <p className="text-muted-foreground mb-4">
              Video plays full-screen with audio, overlays show event details
            </p>
            <Button variant="outline" className="w-full">
              See Features
            </Button>
          </Card>
        </div>

        {/* Mobile App Preview */}
        <div className="mt-16">
          <Card className="p-8 shadow-strong bg-gradient-to-br from-muted/50 to-background">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  Instant AR Magic
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Lightning Fast Recognition</h4>
                      <p className="text-muted-foreground">AR locks onto printed pages in under 1 second</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Download className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Offline Ready</h4>
                      <p className="text-muted-foreground">Download once, scan anywhere without internet</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Rich Media Experience</h4>
                      <p className="text-muted-foreground">Full-screen videos with audio and custom overlays</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button variant="hero" size="xl">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Request Mobile Demo
                  </Button>
                </div>
              </div>
              
              {/* Mock Phone Interface */}
              <div className="flex justify-center">
                <div className="w-64 h-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-4 shadow-strong">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                    <div className="h-8 bg-primary flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Memories AR Scanner</span>
                    </div>
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex-1 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center">
                          <ScanLine className="w-12 h-12 text-primary mx-auto mb-2" />
                          <p className="text-xs font-medium">Point at album page</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gradient-primary rounded-full"></div>
                        <p className="text-xs text-center text-muted-foreground">
                          AR Target Detected
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MobileInterface;