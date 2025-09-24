import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Plus, FileText, Calendar, User } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch business applications
        const { data: appsData } = await supabase
          .from('business_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch consultation requests
        const { data: consultData } = await supabase
          .from('consultation_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setApplications(appsData || []);
        setConsultations(consultData || []);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      case 'submitted': return 'bg-info text-info-foreground';
      case 'scheduled': return 'bg-info text-info-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {profile?.first_name || user?.email}!
            </h1>
            <p className="text-muted-foreground">
              Manage your business formation and consultation requests
            </p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="applications" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">
              <FileText className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="consultations">
              <Calendar className="h-4 w-4 mr-2" />
              Consultations
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Business Applications</h2>
              <Button onClick={() => navigate('/form-llc')}>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </div>

            {applications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first business formation application today
                  </p>
                  <Button onClick={() => navigate('/form-llc')}>
                    Create Your First Application
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((app) => (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{app.business_name}</CardTitle>
                          <CardDescription>
                            {app.business_type} in {app.state}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Consultation Requests</h2>
              <Button onClick={() => navigate('/consultation')}>
                <Plus className="h-4 w-4 mr-2" />
                Request Consultation
              </Button>
            </div>

            {consultations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No consultations yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Book a free consultation with our business formation experts
                  </p>
                  <Button onClick={() => navigate('/consultation')}>
                    Request Free Consultation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {consultations.map((consult) => (
                  <Card key={consult.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{consult.consultation_type}</CardTitle>
                          <CardDescription>
                            {consult.business_type} consultation
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(consult.status)}>
                          {consult.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Requested: {new Date(consult.created_at).toLocaleDateString()}
                      </p>
                      {consult.questions && (
                        <p className="text-sm mt-2">
                          <strong>Questions:</strong> {consult.questions}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                {profile?.first_name && (
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-muted-foreground">
                      {profile.first_name} {profile.last_name}
                    </p>
                  </div>
                )}
                {profile?.phone && (
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-muted-foreground">{profile.phone}</p>
                  </div>
                )}
                {profile?.company_name && (
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <p className="text-muted-foreground">{profile.company_name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;