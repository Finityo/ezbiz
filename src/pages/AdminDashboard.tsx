import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Phone, Mail, Calendar, Filter, Search, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type: string;
  consultation_type: string;
  questions: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!adminLoading && !isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchConsultations = async () => {
      try {
        const { data, error } = await supabase
          .from('consultation_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setConsultations(data || []);
      } catch (error) {
        console.error('Error fetching consultations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load consultation requests',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user, isAdmin, toast]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === id
            ? { ...consultation, status: newStatus }
            : consultation
        )
      );

      toast({
        title: 'Status updated',
        description: `Consultation status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'contacted': return 'bg-info text-info-foreground';
      case 'scheduled': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.business_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesBusinessType = businessTypeFilter === 'all' || consultation.business_type === businessTypeFilter;

    return matchesSearch && matchesStatus && matchesBusinessType;
  });

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage consultation requests and client communications
            </p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{consultations.length}</CardTitle>
              <CardDescription>Total Requests</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {consultations.filter(c => c.status === 'pending').length}
              </CardTitle>
              <CardDescription>Pending</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {consultations.filter(c => c.status === 'contacted').length}
              </CardTitle>
              <CardDescription>Contacted</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {consultations.filter(c => c.status === 'completed').length}
              </CardTitle>
              <CardDescription>Completed</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or business type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Requests ({filteredConsultations.length})</CardTitle>
            <CardDescription>
              View and manage all client consultation requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No consultation requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Business Type</TableHead>
                      <TableHead>Consultation Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultations.map((consultation) => (
                      <TableRow key={consultation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{consultation.name}</div>
                            {consultation.questions && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {consultation.questions.substring(0, 50)}
                                {consultation.questions.length > 50 ? '...' : ''}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              <a 
                                href={`mailto:${consultation.email}`}
                                className="text-primary hover:underline"
                              >
                                {consultation.email}
                              </a>
                            </div>
                            {consultation.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-1" />
                                <a 
                                  href={`tel:${consultation.phone}`}
                                  className="text-primary hover:underline"
                                >
                                  {consultation.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{consultation.business_type}</TableCell>
                        <TableCell className="capitalize">{consultation.consultation_type}</TableCell>
                        <TableCell>
                          <Select
                            value={consultation.status}
                            onValueChange={(value) => updateStatus(consultation.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <Badge className={getStatusColor(consultation.status)}>
                                {consultation.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(consultation.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const subject = encodeURIComponent(`Re: ${consultation.consultation_type} consultation`);
                                const body = encodeURIComponent(`Hi ${consultation.name},\n\nThank you for your interest in our ${consultation.business_type} formation services. I'd like to schedule a consultation to discuss your needs.\n\nBest regards,\nFinityo Team`);
                                window.open(`mailto:${consultation.email}?subject=${subject}&body=${body}`);
                              }}
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            {consultation.phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`tel:${consultation.phone}`)}
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;