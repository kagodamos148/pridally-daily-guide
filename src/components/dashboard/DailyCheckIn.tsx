import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useHealth, HealthMetric } from '@/contexts/HealthContext';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface DailyCheckInProps {
  onComplete: () => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onComplete }) => {
  const { metrics, submitDailyEntry } = useHealth();
  const { toast } = useToast();
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const currentMetric = metrics[currentMetricIndex];
  const isLastMetric = currentMetricIndex === metrics.length - 1;
  const isFirstMetric = currentMetricIndex === 0;

  const handleQuestionResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const isCurrentMetricComplete = () => {
    return currentMetric.questions.every(
      question => responses[question.id] !== undefined
    );
  };

  const handleNext = () => {
    if (isLastMetric) {
      // Complete the check-in
      submitDailyEntry(responses);
      toast({
        title: "Daily check-in completed! 🎉",
        description: "Great job tracking your health today. Keep up the good work!",
      });
      onComplete();
    } else {
      setCurrentMetricIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstMetric) {
      setCurrentMetricIndex(prev => prev - 1);
    }
  };

  const renderQuestion = (question: any) => {
    const currentValue = responses[question.id];

    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={question.id} className="text-base font-medium">
                {question.question}
              </Label>
              <div className="px-4 py-6">
                <Slider
                  id={question.id}
                  min={question.scale.min}
                  max={question.scale.max}
                  step={1}
                  value={currentValue ? [currentValue] : [Math.floor((question.scale.min + question.scale.max) / 2)]}
                  onValueChange={(value) => handleQuestionResponse(question.id, value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{question.scale.labels[0]}</span>
                  <span className="font-semibold text-primary">
                    {currentValue || Math.floor((question.scale.min + question.scale.max) / 2)}
                  </span>
                  <span>{question.scale.labels[question.scale.labels.length - 1]}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-4">
            <Label className="text-base font-medium">{question.question}</Label>
            <div className="flex space-x-4">
              <Button
                variant={currentValue === true ? 'default' : 'outline'}
                onClick={() => handleQuestionResponse(question.id, true)}
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                variant={currentValue === false ? 'default' : 'outline'}
                onClick={() => handleQuestionResponse(question.id, false)}
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <Label htmlFor={question.id} className="text-base font-medium">
              {question.question}
            </Label>
            <Textarea
              id={question.id}
              placeholder="Share your thoughts..."
              value={currentValue || ''}
              onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-medium animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">Daily Health Check-in</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Track your wellness with {metrics.length} key health metrics
          </CardDescription>
          <div className="flex justify-center mt-4">
            <div className="text-sm">
              {currentMetricIndex + 1} of {metrics.length} metrics
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 animate-fade-in">
        <div 
          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentMetricIndex + 1) / metrics.length) * 100}%` }}
        />
      </div>

      {/* Current Metric */}
      <Card className="shadow-medium animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 text-4xl animate-float">
            {currentMetric.icon}
          </div>
          <CardTitle className="text-xl">{currentMetric.name}</CardTitle>
          <CardDescription>{currentMetric.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {currentMetric.questions.map((question, index) => (
            <div 
              key={question.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {renderQuestion(question)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center animate-fade-in">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstMetric}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-2">
          {metrics.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentMetricIndex
                  ? 'bg-primary'
                  : index < currentMetricIndex
                  ? 'bg-success'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!isCurrentMetricComplete()}
          className="flex items-center space-x-2 bg-gradient-primary text-primary-foreground hover:opacity-90"
        >
          {isLastMetric ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete</span>
            </>
          ) : (
            <>
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DailyCheckIn;