import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Camera, LogOut, User, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Memories</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {location.pathname !== '/' && (
              <Button variant="outline" size="sm" onClick={() => handleNavigation('/')}>
                Upload
              </Button>
            )}
            {location.pathname !== '/scanner' && (
              <Button variant="outline" size="sm" onClick={() => handleNavigation('/scanner')}>
                <Camera className="w-4 h-4 mr-2" />
                Scanner
              </Button>
            )}
            {location.pathname !== '/simple-ar' && (
              <Button variant="outline" size="sm" onClick={() => handleNavigation('/simple-ar')}>
                Simple AR
              </Button>
            )}
            {location.pathname !== '/true-ar' && (
              <Button variant="outline" size="sm" onClick={() => handleNavigation('/true-ar')}>
                True AR
              </Button>
            )}
            
            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button size="sm" onClick={() => handleNavigation('/auth')}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
            <div className="py-4 space-y-2">
              {location.pathname !== '/' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation('/')}
                >
                  Upload
                </Button>
              )}
              {location.pathname !== '/scanner' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation('/scanner')}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Demo Scanner
                </Button>
              )}
              {location.pathname !== '/simple-ar' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation('/simple-ar')}
                >
                  🎯 Simple AR
                </Button>
              )}
              {location.pathname !== '/true-ar' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation('/true-ar')}
                >
                  ✨ True AR
                </Button>
              )}
              {location.pathname !== '/real-ar' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation('/real-ar')}
                >
                  🔬 Advanced AR
                </Button>
              )}
              {location.pathname !== '/nft-ar' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation('/nft-ar')}
                >
                  🎯 NFT AR
                </Button>
              )}
              {location.pathname !== '/camera-test' && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation('/camera-test')}
                >
                  📱 Camera Test
                </Button>
              )}
              
              {user ? (
                <div className="pt-2 border-t">
                  <p className="px-4 py-2 text-sm text-muted-foreground">{user.email}</p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => handleNavigation('/auth')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={() => handleNavigation('/auth')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;