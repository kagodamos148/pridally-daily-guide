import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in-person' | 'telemedicine';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const DoctorScheduling: React.FC = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Primary Care',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'in-person',
      status: 'scheduled',
      notes: 'Regular health check-up and review of wellness metrics'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Mental Health',
      date: '2024-01-20',
      time: '2:30 PM',
      type: 'telemedicine',
      status: 'scheduled',
      notes: 'Follow-up on stress management and mood tracking'
    }
  ]);

  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    type: 'in-person' as 'in-person' | 'telemedicine',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      status: 'scheduled'
    };

    setAppointments(prev => [...prev, newAppointment]);
    setFormData({
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      type: 'in-person',
      notes: ''
    });
    setShowForm(false);

    toast({
      title: "Appointment scheduled! 📅",
      description: `Your appointment with ${formData.doctorName} has been scheduled for ${formData.date} at ${formData.time}.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-primary" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments
    .filter(apt => apt.status !== 'scheduled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-medium animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2 flex items-center justify-center space-x-2">
            <Stethoscope className="h-6 w-6" />
            <span>Doctor Appointments</span>
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Schedule and manage your healthcare appointments
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          <p className="text-muted-foreground">You have {upcomingAppointments.length} upcoming appointments</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medium"
        >
          Schedule New Appointment
        </Button>
      </div>

      {/* Scheduling Form */}
      {showForm && (
        <Card className="shadow-medium animate-scale-in">
          <CardHeader>
            <CardTitle>Schedule New Appointment</CardTitle>
            <CardDescription>
              Fill in the details for your healthcare appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input
                    id="doctorName"
                    placeholder="Dr. John Smith"
                    value={formData.doctorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary-care">Primary Care</SelectItem>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                      <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Appointment Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'in-person' | 'telemedicine') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person Visit</SelectItem>
                    <SelectItem value="telemedicine">Telemedicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific concerns or topics to discuss..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  Schedule Appointment
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        {upcomingAppointments.map((appointment, index) => (
          <Card 
            key={appointment.id} 
            className="shadow-soft hover:shadow-medium transition-all duration-200 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                      <p className="text-muted-foreground">{appointment.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appointment.type === 'in-person' ? (
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{appointment.type === 'in-person' ? 'In-Person' : 'Telemedicine'}</span>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {appointment.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(appointment.status)}
                  <Badge variant={getStatusColor(appointment.status) as any}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {upcomingAppointments.length === 0 && (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
              <p className="text-muted-foreground mb-4">
                Schedule your next healthcare appointment to stay on top of your wellness journey.
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Past Appointments</h2>
          {pastAppointments.map((appointment, index) => (
            <Card 
              key={appointment.id} 
              className="shadow-soft opacity-75 hover:opacity-100 transition-all duration-200 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-full">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{appointment.doctorName}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{appointment.specialty}</span>
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant={getStatusColor(appointment.status) as any}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorScheduling;