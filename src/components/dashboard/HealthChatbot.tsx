import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useHealth } from '@/contexts/HealthContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Heart, 
  Activity, 
  Brain,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const HealthChatbot: React.FC = () => {
  const { user } = useAuth();
  const { dailyEntries, hasCompletedToday } = useHealth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello ${user?.name}! I'm your AI wellness assistant. I'm here to help you with health tips, answer questions about your wellness journey, and provide personalized insights based on your daily check-ins.`,
      timestamp: new Date(),
      suggestions: [
        "How can I improve my sleep?",
        "Give me wellness tips",
        "Analyze my recent progress",
        "Help with stress management"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Analyze user's data for personalized responses
    const recentEntries = dailyEntries.slice(-7); // Last 7 days
    const completionRate = recentEntries.length > 0 
      ? Math.round((recentEntries.filter(entry => entry.completed).length / recentEntries.length) * 100)
      : 0;

    // Health-related responses
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('rest')) {
      return `Based on your recent check-ins, here are some personalized sleep tips:\n\n• Maintain a consistent sleep schedule, even on weekends\n• Create a relaxing bedtime routine 1 hour before sleep\n• Keep your bedroom cool (65-68°F) and dark\n• Avoid screens 1 hour before bedtime\n• Try gentle stretching or meditation before bed\n\nYour recent sleep tracking shows you're making progress! Keep up the good work. 😴`;
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return `I understand stress can be challenging. Here are some evidence-based techniques that can help:\n\n• Deep breathing: Try the 4-7-8 technique (inhale 4, hold 7, exhale 8)\n• Progressive muscle relaxation\n• Mindfulness meditation for 5-10 minutes daily\n• Regular physical activity (even a 10-minute walk helps)\n• Connect with supportive friends or family\n\nRemember, your daily check-ins help track these patterns. If stress persists, consider speaking with a healthcare professional. 🧠💙`;
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) {
      return `Great question! Here's how to build sustainable exercise habits:\n\n• Start small: Even 10-15 minutes of activity daily makes a difference\n• Find activities you enjoy (dancing, walking, swimming, etc.)\n• Set realistic goals and gradually increase intensity\n• Schedule workouts like important appointments\n• Track your progress in your daily check-ins\n\nConsistency matters more than intensity. Your body will thank you! 💪`;
    }
    
    if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eating')) {
      return `Nutrition plays a huge role in how you feel! Here are some sustainable tips:\n\n• Focus on whole foods: fruits, vegetables, lean proteins, whole grains\n• Stay hydrated (aim for 8 glasses of water daily)\n• Practice mindful eating - eat slowly and listen to hunger cues\n• Plan meals ahead to avoid impulsive food choices\n• Remember: it's about progress, not perfection\n\nYour nutrition tracking in daily check-ins helps identify patterns. Keep it up! 🥗`;
    }
    
    if (lowerMessage.includes('progress') || lowerMessage.includes('analyze') || lowerMessage.includes('data')) {
      return `Let me analyze your recent wellness journey:\n\n📊 **Your Stats:**\n• Completion rate: ${completionRate}% over the last week\n• Total check-ins: ${dailyEntries.length}\n• Today's status: ${hasCompletedToday ? 'Completed ✅' : 'Pending ⏳'}\n\n🎯 **Insights:**\n${completionRate >= 80 ? '• Excellent consistency! You\'re building strong healthy habits.' : '• Consider setting daily reminders to improve consistency.'}\n• Your commitment to tracking shows you value your health\n• Each check-in helps identify patterns and improvements\n\nKeep up the great work! Every day is a step toward better health. 📈`;
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return `You're already taking amazing steps by using daily health tracking! Remember:\n\n✨ **Every small step counts**\n• Consistency beats perfection\n• Progress isn't always linear\n• You're investing in your future self\n\n💪 **You've got this because:**\n• You're actively monitoring your health\n• You're seeking guidance and support\n• You're committed to improvement\n\nHealth is a journey, not a destination. I'm here to support you every step of the way! 🌟`;
    }
    
    if (lowerMessage.includes('tips') || lowerMessage.includes('advice') || lowerMessage.includes('suggestions')) {
      return `Here are some general wellness tips tailored for you:\n\n🌅 **Morning Routine:**\n• Start with 5 minutes of deep breathing or stretching\n• Drink a glass of water upon waking\n• Set positive intentions for the day\n\n🏃 **Throughout the Day:**\n• Take movement breaks every hour\n• Practice gratitude - notice 3 good things daily\n• Stay connected with supportive people\n\n🌙 **Evening Wind-down:**\n• Complete your daily health check-in\n• Reflect on the day's accomplishments\n• Prepare for quality sleep\n\nYour daily tracking helps personalize these recommendations! 🎯`;
    }
    
    // Default response
    return `I'm here to help with your wellness journey! I can assist with:\n\n• 🧠 Mental health and stress management tips\n• 😴 Sleep improvement strategies\n• 💪 Exercise and fitness guidance\n• 🥗 Nutrition and healthy eating advice\n• 📊 Analysis of your health tracking progress\n• 💡 Personalized wellness recommendations\n\nWhat specific area would you like to explore today?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputMessage),
        timestamp: new Date(),
        suggestions: [
          "Tell me more about this",
          "Give me specific tips",
          "How can I track this?",
          "What else should I know?"
        ]
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-medium animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2 flex items-center justify-center space-x-2">
            <MessageCircle className="h-6 w-6" />
            <span>AI Wellness Assistant</span>
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Get personalized health insights and wellness guidance
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <Card className="shadow-medium animate-scale-in">
        <CardContent className="p-0">
          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/10">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border shadow-soft'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.type === 'bot' && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs opacity-70">Quick suggestions:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-7 px-2"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="p-2 rounded-full bg-accent text-accent-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-3 rounded-lg bg-card border shadow-soft">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me about your health, wellness tips, or any questions..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="animate-fade-in">
        <CardContent className="p-4">
          <div className="text-sm font-medium mb-3 flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-accent" />
            <span>Popular topics to explore:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Brain, text: "Stress Management", color: "medical-calm" },
              { icon: Activity, text: "Exercise Tips", color: "medical-energy" },
              { icon: Heart, text: "Sleep Improvement", color: "medical-blue" },
              { icon: TrendingUp, text: "Progress Analysis", color: "medical-focus" }
            ].map((topic, index) => (
              <Button
                key={topic.text}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(`Give me tips about ${topic.text.toLowerCase()}`)}
                className="flex items-center space-x-2 animate-scale-in hover:shadow-soft"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <topic.icon className="h-4 w-4" />
                <span>{topic.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthChatbot;