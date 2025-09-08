import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Camera } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Memories</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {location.pathname !== '/' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                Upload
              </Button>
            )}
            {location.pathname !== '/scanner' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/scanner')}
              >
                <Camera className="w-4 h-4 mr-2" />
                Scanner
              </Button>
            )}
            <Button variant="outline" size="sm">Log In</Button>
            <Button size="sm">Sign Up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;