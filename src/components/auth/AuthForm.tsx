import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Heart } from 'lucide-react';

interface AuthFormProps {
  onBack: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onBack }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signin, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      
      if (isSignIn) {
        success = await signin(email, password);
      } else {
        success = await signup(email, password, name);
      }

      if (success) {
        toast({
          title: isSignIn ? "Welcome back!" : "Account created!",
          description: isSignIn ? "You've been signed in successfully." : "Your account has been created and you're now signed in.",
        });
      } else {
        toast({
          title: "Authentication failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm shadow-strong animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
            <Heart className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignIn ? 'Welcome Back' : 'Join Pridally'}
          </CardTitle>
          <CardDescription>
            {isSignIn 
              ? 'Sign in to continue your wellness journey' 
              : 'Start tracking your health and wellness today'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isSignIn}
                  className="bg-background/50"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medium"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-primary hover:text-primary/80"
            >
              {isSignIn ? 'Create Account' : 'Sign In'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full border-border/50 hover:bg-secondary/50"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;