import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Camera, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
              Demo Scanner
            </Button>
          )}
          {location.pathname !== '/simple-ar' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/simple-ar')}
            >
              🎯 Simple AR
            </Button>
          )}
          {location.pathname !== '/true-ar' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/true-ar')}
            >
              ✨ True AR
            </Button>
          )}
          {location.pathname !== '/real-ar' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/real-ar')}
            >
              🔬 Advanced AR
            </Button>
          )}
          {location.pathname !== '/nft-ar' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/nft-ar')}
            >
              🎯 NFT AR
            </Button>
          )}
          
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;