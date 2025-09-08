import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Code, Download, Zap } from "lucide-react";

const MobileDevelopment = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-accent/5 to-secondary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Native Mobile AR Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The AR scanning functionality requires native mobile capabilities. 
            We'll use Capacitor to transform this web app into native iOS and Android apps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center shadow-medium">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-3">Capacitor Integration</h3>
            <p className="text-sm text-muted-foreground">
              Bridge web technologies with native mobile capabilities for camera access and AR processing
            </p>
          </Card>

          <Card className="p-6 text-center shadow-medium">
            <div className="w-12 h-12 bg-gradient-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-3">Camera & AR Access</h3>
            <p className="text-sm text-muted-foreground">
              Native camera permissions and AR libraries for real-time target detection and tracking
            </p>
          </Card>

          <Card className="p-6 text-center shadow-medium">
            <div className="w-12 h-12 bg-gradient-hero rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-3">Offline Performance</h3>
            <p className="text-sm text-muted-foreground">
              Local storage and processing for smooth offline AR scanning experience
            </p>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-white to-muted/30 shadow-strong">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Ready for Mobile Development?</h3>
                <p className="text-muted-foreground mb-6">
                  To enable the full AR scanning experience, you'll need to:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Install Capacitor for native mobile bridge</li>
                  <li>• Add camera and AR detection libraries</li>
                  <li>• Configure iOS and Android projects</li>
                  <li>• Test on physical devices</li>
                </ul>
                <Button variant="hero" size="lg" className="w-full md:w-auto">
                  <Download className="w-5 h-5 mr-2" />
                  Setup Mobile Development
                </Button>
              </div>
              
              <div className="text-center">
                <div className="relative">
                  <div className="w-48 h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl mx-auto p-4 shadow-strong">
                    <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                      <div className="h-6 bg-primary"></div>
                      <div className="p-4 space-y-4">
                        <div className="h-32 bg-gradient-primary/20 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-secondary/30 rounded"></div>
                          <div className="h-3 bg-secondary/30 rounded w-3/4"></div>
                        </div>
                        <div className="h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <span className="text-xs text-white font-medium">Scan Album</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Native mobile app with AR capabilities
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            💡 After setting up Capacitor, remember to run <code className="bg-muted px-2 py-1 rounded">npx cap sync</code> to sync changes to native platforms
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileDevelopment;