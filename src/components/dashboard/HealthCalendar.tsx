import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHealth } from '@/contexts/HealthContext';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const HealthCalendar: React.FC = () => {
  const { dailyEntries, getDailyEntry } = useHealth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDay = (day: number) => {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = formatDate(dayDate);
    const entry = getDailyEntry(dateString);
    const today = isToday(day);
    const isPast = dayDate < new Date(new Date().setHours(0, 0, 0, 0));

    let status = 'default';
    let icon = null;

    if (entry && entry.completed) {
      status = 'success';
      icon = <CheckCircle2 className="h-3 w-3" />;
    } else if (isPast) {
      status = 'missed';
      icon = <XCircle className="h-3 w-3" />;
    }

    return (
      <div
        key={day}
        className={`
          relative aspect-square flex flex-col items-center justify-center p-1 rounded-lg text-sm
          transition-all duration-200 hover:scale-105 cursor-pointer animate-scale-in
          ${today ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${status === 'success' ? 'bg-success/20 text-success' : ''}
          ${status === 'missed' ? 'bg-destructive/20 text-destructive' : ''}
          ${status === 'default' && !isPast ? 'bg-muted/30 hover:bg-muted/50' : ''}
        `}
        style={{ animationDelay: `${day * 0.01}s` }}
      >
        <span className="font-medium">{day}</span>
        {icon && <div className="mt-1">{icon}</div>}
        {today && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
        )}
      </div>
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate stats
  const currentMonthEntries = dailyEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() === currentDate.getFullYear() &&
      entryDate.getMonth() === currentDate.getMonth()
    );
  });

  const completedDays = currentMonthEntries.filter(entry => entry.completed).length;
  const totalPossibleDays = Math.min(daysInMonth, new Date().getDate());
  const completionRate = totalPossibleDays > 0 ? Math.round((completedDays / totalPossibleDays) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-medium animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2 flex items-center justify-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Health Tracking Calendar</span>
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Visualize your daily wellness journey and track your consistency
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-scale-in">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{completedDays}</div>
            <div className="text-sm text-muted-foreground">Days Completed</div>
          </CardContent>
        </Card>
        
        <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{completionRate}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>
        
        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{currentMonthEntries.length}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="shadow-medium animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <CardTitle className="text-xl">{monthName}</CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => renderCalendarDay(i + 1))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success/20 rounded flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-success" />
              </div>
              <span className="text-sm">Completed Check-in</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-destructive/20 rounded flex items-center justify-center">
                <XCircle className="h-3 w-3 text-destructive" />
              </div>
              <span className="text-sm">Missed Check-in</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-muted/30 rounded" />
              <span className="text-sm">Future Date</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-muted/30 rounded ring-2 ring-primary ring-offset-1" />
              <span className="text-sm">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthCalendar;