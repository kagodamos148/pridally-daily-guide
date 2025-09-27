import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHealth } from '@/contexts/HealthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MessageCircle, 
  Stethoscope, 
  LogOut, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  User
} from 'lucide-react';
import DailyCheckIn from './DailyCheckIn';
import HealthCalendar from './HealthCalendar';
import DoctorScheduling from './DoctorScheduling';
import HealthChatbot from './HealthChatbot';

type ActiveView = 'overview' | 'checkin' | 'calendar' | 'schedule' | 'chat';

const Dashboard: React.FC = () => {
  const { user, signout } = useAuth();
  const { metrics, hasCompletedToday, dailyEntries } = useHealth();
  const [activeView, setActiveView] = useState<ActiveView>('overview');

  const completionRate = dailyEntries.length > 0 
    ? Math.round((dailyEntries.filter(entry => entry.completed).length / dailyEntries.length) * 100)
    : 0;

  const currentStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const entry = dailyEntries.find(e => e.date === dateString);
      if (entry && entry.completed) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'checkin':
        return <DailyCheckIn onComplete={() => setActiveView('overview')} />;
      case 'calendar':
        return <HealthCalendar />;
      case 'schedule':
        return <DoctorScheduling />;
      case 'chat':
        return <HealthChatbot />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <Card className="bg-gradient-primary text-primary-foreground shadow-medium animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Welcome back, {user?.name}! 👋
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      {hasCompletedToday 
                        ? "Great job! You&apos;ve completed today&apos;s check-in." 
                        : "Ready for your daily wellness check-in?"}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-primary-foreground/80">Current Streak</div>
                    <div className="text-3xl font-bold">{currentStreak()} days</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="animate-scale-in">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-success/10 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">{completionRate}%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{dailyEntries.length}</div>
                      <div className="text-sm text-muted-foreground">Total Check-ins</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{currentStreak()}</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Status */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Today&apos;s Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasCompletedToday ? (
                  <div className="flex items-center space-x-3 p-4 bg-success/10 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                    <div>
                      <div className="font-semibold text-success">Daily check-in completed!</div>
                      <div className="text-sm text-muted-foreground">
                        You&apos;ve successfully tracked all your health metrics today.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-warning/10 rounded-lg">
                      <Clock className="h-6 w-6 text-warning" />
                      <div>
                        <div className="font-semibold text-warning">Daily check-in pending</div>
                        <div className="text-sm text-muted-foreground">
                          Complete your health metrics for today to maintain your streak.
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setActiveView('checkin')}
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medium"
                    >
                      Complete Daily Check-in
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Metrics Preview */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Your Health Metrics</CardTitle>
                <CardDescription>
                  Track these 5 key areas of your wellness journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {metrics.map((metric, index) => (
                    <div 
                      key={metric.id}
                      className="p-4 border rounded-lg hover:shadow-soft transition-all duration-200 animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-2xl">{metric.icon}</div>
                        <div className="font-semibold text-sm">{metric.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {metric.questions.length} questions
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card shadow-soft border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Pridally</h1>
              <Badge variant="outline" className="hidden md:flex">
                Daily Health Tracker
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeView === 'overview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('overview')}
              >
                Overview
              </Button>
              <Button
                variant={activeView === 'checkin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('checkin')}
                disabled={hasCompletedToday}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Check-in
              </Button>
              <Button
                variant={activeView === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('calendar')}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Calendar
              </Button>
              <Button
                variant={activeView === 'schedule' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('schedule')}
              >
                <Stethoscope className="h-4 w-4 mr-1" />
                Schedule
              </Button>
              <Button
                variant={activeView === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('chat')}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={signout}
                className="ml-4"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Dashboard;