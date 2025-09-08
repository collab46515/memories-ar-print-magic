import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Shield, Zap, Server } from "lucide-react";

const BackendInfo = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by Supabase Backend
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            To enable full functionality like video uploads, AR target generation, and multi-school management, 
            you'll need to connect this platform to Supabase.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center shadow-medium">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Video Storage</h3>
            <p className="text-sm text-muted-foreground">
              Secure cloud storage for all school videos and generated album pages
            </p>
          </Card>

          <Card className="p-6 text-center shadow-medium">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Tenant Security</h3>
            <p className="text-sm text-muted-foreground">
              Each school's data is isolated with row-level security policies
            </p>
          </Card>

          <Card className="p-6 text-center shadow-medium">
            <div className="w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-3">AR Target API</h3>
            <p className="text-sm text-muted-foreground">
              Edge functions to generate and validate AR targets for album pages
            </p>
          </Card>

          <Card className="p-6 text-center shadow-medium">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Sync</h3>
            <p className="text-sm text-muted-foreground">
              Live updates between web dashboard and mobile apps
            </p>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8 bg-gradient-to-br from-white to-muted/30 shadow-strong">
            <h3 className="text-2xl font-bold mb-4">Ready to Enable Backend Features?</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Click the green Supabase button in the top right to connect your database and unlock 
              video uploads, AR target generation, user authentication, and multi-school management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                <Database className="w-5 h-5 mr-2" />
                Connect Supabase Now
              </Button>
              <Button variant="outline" size="lg">
                Learn More About Integration
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Once connected, you'll have access to authentication, database management, 
              file storage, and edge functions for AR processing.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BackendInfo;