import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Brain, Calendar, MessageCircle, Shield } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Heart,
      title: 'Daily Health Check-ins',
      description: 'Track 5 key wellness metrics with simple, personalized questions every day.'
    },
    {
      icon: Calendar,
      title: 'Progress Calendar',
      description: 'Visualize your consistency with an intuitive calendar showing your daily completions.'
    },
    {
      icon: Activity,
      title: 'Wellness Analytics',
      description: 'Get insights into your health patterns and track improvements over time.'
    },
    {
      icon: MessageCircle,
      title: 'AI Health Assistant',
      description: 'Chat with our wellness bot for personalized tips and health guidance.'
    },
    {
      icon: Brain,
      title: 'Mental Health Focus',
      description: 'Comprehensive mood tracking and mental wellness monitoring tools.'
    },
    {
      icon: Shield,
      title: 'Doctor Integration',
      description: 'Schedule appointments and share your health data with healthcare providers.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Your Daily Health
            <span className="block bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
              Journey Starts Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto animate-slide-up">
            Track your wellness with daily check-ins, monitor key health metrics, 
            and build lasting healthy habits with personalized insights.
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-glow animate-scale-in text-lg px-8 py-4"
          >
            Start Your Wellness Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300 animate-scale-in border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 animate-float">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 shadow-soft animate-fade-in">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5</div>
              <div className="text-muted-foreground">Health Metrics</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">Daily</div>
              <div className="text-muted-foreground">Check-ins</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have improved their wellbeing with daily health tracking.
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-glow text-lg px-8 py-4"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;