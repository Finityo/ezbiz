import SEOHead from "@/components/SEOHead";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Search, Phone, Mail, MessageSquare, Filter, Download, ExternalLink, FileText, BarChart3, Star, Package, HandHelping, Users } from 'lucide-react';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import FeedbackTab from '@/components/admin/FeedbackTab';
import OrdersTab from '@/components/admin/OrdersTab';
import WhiteGloveBillingTab from '@/components/admin/WhiteGloveBillingTab';
import UsersTab from '@/components/admin/UsersTab';
import ApplicationQuickEditDialog from '@/components/admin/ApplicationQuickEditDialog';
import { Pencil } from 'lucide-react';


interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_type: string;
  consultation_type: string;
  questions: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BusinessApplication {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  state: string;
  status: string;
  application_data: any;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationRequest[]>([]);
  const [applications, setApplications] = useState<BusinessApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<BusinessApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Consultation filters
  const [consultationSearchTerm, setConsultationSearchTerm] = useState('');
  const [consultationStatusFilter, setConsultationStatusFilter] = useState('all');
  const [consultationBusinessTypeFilter, setConsultationBusinessTypeFilter] = useState('all');
  
  // Application filters
  const [applicationSearchTerm, setApplicationSearchTerm] = useState('');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
  const [applicationBusinessTypeFilter, setApplicationBusinessTypeFilter] = useState('all');
  const [applicationStateFilter, setApplicationStateFilter] = useState('all');
  const [editAppId, setEditAppId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    checkAdminStatus();
  }, [user, navigate]);

  const checkAdminStatus = async () => {
    try {
      // Defense-in-depth: require @ezbiz-fs.com email AND admin role.
      // Real enforcement lives in DB triggers + edge functions.
      const email = (user?.email ?? '').toLowerCase();
      if (!email.endsWith('@ezbiz-fs.com')) {
        toast({
          title: "Access Denied",
          description: "Admin access is restricted to EZ Biz staff accounts.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleData) {
        setIsAdmin(true);
        fetchConsultations();
        fetchApplications();
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/dashboard');
    }
  };


  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('business_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
      setFilteredApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch business applications.",
        variant: "destructive",
      });
    }
  };

  const fetchConsultations = async () => {
    try {
      // Consultation requests are stored in email_list with consultation source
      const { data, error } = await supabase
        .from('email_list')
        .select('*')
        .like('source', 'consultation_%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map email_list data to consultation format
      const consultationData = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone ?? null,
        business_type: item.business_type ?? '',
        consultation_type: item.source.replace('consultation_', ''),
        questions: null,
        status: item.status || 'pending',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setConsultations(consultationData);
      setFilteredConsultations(consultationData);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch consultation requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('email_list')
        .update({ status: newStatus } as any)
        .eq('id', id);

      if (error) throw error;

      setConsultations(prev =>
        prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
      );
      setFilteredConsultations(prev =>
        prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
      );

      toast({
        title: "Status Updated",
        description: `Consultation status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('business_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => 
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );
      setFilteredApplications(prev => 
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );

      toast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let filtered = consultations;

    // Filter by search term
    if (consultationSearchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(consultationSearchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(consultationSearchTerm.toLowerCase()) ||
        (c.phone && c.phone.includes(consultationSearchTerm))
      );
    }

    // Filter by status
    if (consultationStatusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === consultationStatusFilter);
    }

    // Filter by business type
    if (consultationBusinessTypeFilter !== 'all') {
      filtered = filtered.filter(c => c.business_type === consultationBusinessTypeFilter);
    }

    setFilteredConsultations(filtered);
  }, [consultations, consultationSearchTerm, consultationStatusFilter, consultationBusinessTypeFilter]);

  useEffect(() => {
    let filtered = applications;
    if (applicationSearchTerm) {
      filtered = filtered.filter(a =>
        a.business_name.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
        a.user_id.toLowerCase().includes(applicationSearchTerm.toLowerCase())
      );
    }
    if (applicationStatusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === applicationStatusFilter);
    }
    if (applicationBusinessTypeFilter !== 'all') {
      filtered = filtered.filter(a => a.business_type === applicationBusinessTypeFilter);
    }
    if (applicationStateFilter !== 'all') {
      filtered = filtered.filter(a => a.state === applicationStateFilter);
    }
    setFilteredApplications(filtered);
  }, [applications, applicationSearchTerm, applicationStatusFilter, applicationBusinessTypeFilter, applicationStateFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'filed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'contacted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in-review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'processing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'scheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const exportConsultationsToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Business Type', 'Consultation Type', 'Status', 'Created Date', 'Questions'];
    const csvContent = [
      headers.join(','),
      ...filteredConsultations.map(c => [
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.phone || ''}"`,
        `"${c.business_type}"`,
        `"${c.consultation_type}"`,
        `"${c.status}"`,
        `"${new Date(c.created_at).toLocaleDateString()}"`,
        `"${c.questions || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportApplicationsToExcel = () => {
    const headers = ['Business Name', 'Business Type', 'State', 'Status', 'User ID', 'Created Date', 'Updated Date'];
    const csvContent = [
      headers.join(','),
      ...filteredApplications.map(app => [
        `"${app.business_name.replace(/"/g, '""')}"`,
        `"${app.business_type}"`,
        `"${app.state}"`,
        `"${app.status}"`,
        `"${app.user_id}"`,
        `"${new Date(app.created_at).toLocaleDateString()}"`,
        `"${new Date(app.updated_at).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Admin" description="Admin dashboard." path="/admin" noIndex />
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading admin dashboard...</div>
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
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage consultation requests and client contacts
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a
              href="/admin/social-preview"
              className="text-sm font-medium text-primary hover:underline"
            >
              Social Preview Tester →
            </a>
            <a
              href="/admin/stripe-prices"
              className="text-sm font-medium text-primary hover:underline"
            >
              Stripe Price Audit →
            </a>
            <a
              href="/admin/email-log"
              className="text-sm font-medium text-primary hover:underline"
            >
              Email Delivery Log →
            </a>
            <a
              href="/admin/test-handoff-email"
              className="text-sm font-medium text-primary hover:underline"
            >
              Test Handoff Email →
            </a>
            <a
              href="/admin/wipe-orders"
              className="text-sm font-medium text-destructive hover:underline"
            >
              Wipe Orders →
            </a>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6 sm:space-y-8">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="orders" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="consultations" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Consultations</span>
              <span className="sm:hidden">Consult</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Applications</span>
              <span className="sm:hidden">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="white-glove" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
              <HandHelping className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">White Glove</span>
              <span className="sm:hidden">WG</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Feedback</span>
              <span className="sm:hidden">FB</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
              <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Users</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{consultations.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {consultations.filter(c => c.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Contacted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {consultations.filter(c => c.status === 'contacted').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {consultations.filter(c => c.status === 'completed').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={consultationSearchTerm}
                      onChange={(e) => setConsultationSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={consultationStatusFilter} onValueChange={setConsultationStatusFilter}>
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
                  <Select value={consultationBusinessTypeFilter} onValueChange={setConsultationBusinessTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Business Types</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={exportConsultationsToCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle>Consultation Requests</CardTitle>
                <CardDescription>
                  Manage and respond to client consultation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact Info</TableHead>
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
                                  "{consultation.questions.substring(0, 50)}{consultation.questions.length > 50 ? '...' : ''}"
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3" />
                                <a 
                                  href={`mailto:${consultation.email}`}
                                  className="text-primary hover:underline"
                                >
                                  {consultation.email}
                                </a>
                              </div>
                              {consultation.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3" />
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
                          <TableCell>
                            <Badge variant="outline">
                              {consultation.business_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{consultation.consultation_type}</TableCell>
                          <TableCell>
                            <Select 
                              value={consultation.status}
                              onValueChange={(value) => updateConsultationStatus(consultation.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue>
                                  <Badge className={getStatusColor(consultation.status)}>
                                    {consultation.status}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(consultation.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(`mailto:${consultation.email}`, '_blank')}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                              {consultation.phone && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => window.open(`tel:${consultation.phone}`, '_blank')}
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
                
                {filteredConsultations.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No consultation requests found</h3>
                    <p className="text-muted-foreground">
                      {consultationSearchTerm || consultationStatusFilter !== 'all' || consultationBusinessTypeFilter !== 'all' 
                        ? "Try adjusting your filters"
                        : "Consultation requests will appear here when clients submit them"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {/* Applications Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Draft</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">
                    {applications.filter(a => a.status === 'draft').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {applications.filter(a => a.status === 'submitted').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {applications.filter(a => a.status === 'processing').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by business name or user ID..."
                      value={applicationSearchTerm}
                      onChange={(e) => setApplicationSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={applicationStatusFilter} onValueChange={setApplicationStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="filed">Filed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={applicationBusinessTypeFilter} onValueChange={setApplicationBusinessTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Business Types</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={applicationStateFilter} onValueChange={setApplicationStateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={exportApplicationsToExcel} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Applications Table */}
            <Card>
              <CardHeader>
                <CardTitle>Business Applications</CardTitle>
                <CardDescription>
                  Manage and track all business formation applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Details</TableHead>
                        <TableHead>Business Type</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{application.business_name}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {application.id.substring(0, 8)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {application.business_type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {application.state}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={application.status}
                              onValueChange={(value) => updateApplicationStatus(application.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue>
                                  <Badge className={getStatusColor(application.status)}>
                                    {application.status}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="in-review">In Review</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="filed">Filed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {application.user_id.substring(0, 8)}...
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(application.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditAppId(application.id)}
                                title="Quick edit"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify(application.application_data, null, 2));
                                  toast({ title: "Copied", description: "Application data copied to clipboard" });
                                }}
                                title="Copy JSON"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredApplications.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No business applications found</h3>
                    <p className="text-muted-foreground">
                      {applicationSearchTerm || applicationStatusFilter !== 'all' || 
                       applicationBusinessTypeFilter !== 'all' || applicationStateFilter !== 'all'
                        ? "Try adjusting your filters"
                        : "Business applications will appear here when clients submit them"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="white-glove" className="space-y-6">
            <WhiteGloveBillingTab />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <FeedbackTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersTab />
          </TabsContent>
        </Tabs>
        <ApplicationQuickEditDialog
          open={!!editAppId}
          onOpenChange={(o) => !o && setEditAppId(null)}
          applicationId={editAppId}
          onSaved={fetchApplications}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;