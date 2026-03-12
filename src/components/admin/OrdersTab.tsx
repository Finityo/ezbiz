import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Download, CheckCircle, Package, Upload, Loader2, FileText } from 'lucide-react';

interface Order {
  id: string;
  user_id: string | null;
  email: string | null;
  state: string | null;
  entity_type: string | null;
  package: string | null;
  status: string | null;
  total_amount: number | null;
  state_fee: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ContactInfo {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
}

interface BizInfo {
  company_name: string | null;
}

/* ── Document Upload Sub-component ── */

function DocumentUploadDialog({ orderId, onUploaded }: { orderId: string; onUploaded: () => void }) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const filePath = `orders/${orderId}/${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage
        .from('order-documents')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('order-documents')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('documents').insert({
        order_id: orderId,
        document_type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        file_url: publicUrl,
      });

      if (dbError) throw dbError;

      // Log event
      await supabase.from('order_events').insert({
        order_id: orderId,
        event_type: 'document_uploaded',
        actor: 'admin',
        metadata: { file_name: file.name },
      });

      toast({ title: 'Uploaded', description: `${file.name} uploaded successfully.` });
      onUploaded();
      if (fileRef.current) fileRef.current.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ title: 'Upload Failed', description: error.message || 'Could not upload file.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" title="Upload Document">
          <Upload className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Upload Document
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Upload a document for order <span className="font-mono text-xs">{orderId.substring(0, 8)}...</span>
          </p>
          <Input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
          <Button onClick={handleUpload} disabled={uploading} className="w-full">
            {uploading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" /> Upload Document</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main OrdersTab ── */

const OrdersTab = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [contactMap, setContactMap] = useState<Map<string, ContactInfo>>(new Map());
  const [bizMap, setBizMap] = useState<Map<string, BizInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const orderList = orderData || [];
      setOrders(orderList);
      setFilteredOrders(orderList);

      if (orderList.length > 0) {
        const ids = orderList.map(o => o.id);
        const [contacts, biz] = await Promise.all([
          supabase.from('contact_information').select('order_id, first_name, last_name, email, phone').in('order_id', ids),
          supabase.from('business_information').select('order_id, company_name').in('order_id', ids),
        ]);
        const cMap = new Map<string, ContactInfo>();
        (contacts.data || []).forEach((c: any) => cMap.set(c.order_id, c));
        setContactMap(cMap);
        const bMap = new Map<string, BizInfo>();
        (biz.data || []).forEach((b: any) => bMap.set(b.order_id, b));
        setBizMap(bMap);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({ title: 'Error', description: 'Failed to fetch orders.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = orders;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(o => {
        const contact = contactMap.get(o.id);
        const biz = bizMap.get(o.id);
        return (
          o.id.toLowerCase().includes(term) ||
          (o.email || '').toLowerCase().includes(term) ||
          (contact?.first_name || '').toLowerCase().includes(term) ||
          (contact?.last_name || '').toLowerCase().includes(term) ||
          (biz?.company_name || '').toLowerCase().includes(term)
        );
      });
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, contactMap, bizMap]);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
      if (error) throw error;

      // Log status change event
      await supabase.from('order_events').insert({
        order_id: id,
        event_type: 'status_changed',
        actor: 'admin',
        metadata: { new_status: newStatus },
      });

      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast({ title: 'Status Updated', description: `Order status set to ${newStatus}` });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({ title: 'Error', description: 'Failed to update order status.', variant: 'destructive' });
    }
  };

  const exportSingleCSV = async (orderId: string) => {
    setExporting(orderId);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const res = await supabase.functions.invoke('export-order-csv', {
        body: { order_id: orderId },
      });

      if (res.error) throw res.error;

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-${orderId.substring(0, 8)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Downloaded', description: 'CSV exported successfully.' });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: 'Export Failed', description: 'Could not export CSV.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  };

  const exportAllCSV = async () => {
    setExporting('all');
    try {
      const res = await supabase.functions.invoke('export-order-csv', {
        body: {},
      });

      if (res.error) throw res.error;

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all-orders-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Downloaded', description: 'All orders exported.' });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: 'Export Failed', description: 'Could not export CSV.', variant: 'destructive' });
    } finally {
      setExporting(null);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'in_progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'payment_complete': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ready_for_submission': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'submitted_to_corpnet': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'processing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'filed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Orders</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{orders.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending Payment</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'Pending Payment').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Payment Complete</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'payment_complete').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Submitted</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'submitted_to_corpnet').length}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                <SelectItem value="payment_complete">Payment Complete</SelectItem>
                <SelectItem value="ready_for_submission">Ready for Submission</SelectItem>
                <SelectItem value="submitted_to_corpnet">Submitted to CorpNet</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="filed">Filed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div /> {/* spacer */}
            <Button onClick={exportAllCSV} variant="outline" disabled={exporting === 'all'}>
              <Download className="h-4 w-4 mr-2" />
              {exporting === 'all' ? 'Exporting...' : 'Export All CSV'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View all orders, download CSV for CorpNet submission, and manage status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Entity / State</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(order => {
                  const contact = contactMap.get(order.id);
                  const biz = bizMap.get(order.id);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell className="font-medium">{biz?.company_name || '—'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {contact ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || '—' : order.email || '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">{contact?.email || order.email || ''}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {order.entity_type && <Badge variant="outline">{order.entity_type}</Badge>}
                          {order.state && <Badge variant="secondary">{order.state}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{order.package || '—'}</TableCell>
                      <TableCell>{order.total_amount != null ? `$${Number(order.total_amount).toFixed(2)}` : '—'}</TableCell>
                      <TableCell>
                        <Select value={order.status || 'Pending Payment'} onValueChange={v => updateOrderStatus(order.id, v)}>
                          <SelectTrigger className="w-40">
                            <SelectValue>
                              <Badge className={getStatusColor(order.status)}>{order.status || 'Pending Payment'}</Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                            <SelectItem value="payment_complete">Payment Complete</SelectItem>
                            <SelectItem value="ready_for_submission">Ready for Submission</SelectItem>
                            <SelectItem value="submitted_to_corpnet">Submitted to CorpNet</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="filed">Filed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={exporting === order.id}
                            onClick={() => exportSingleCSV(order.id)}
                            title="Download CorpNet CSV"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <DocumentUploadDialog orderId={order.id} onUploaded={fetchOrders} />
                          {order.status === 'payment_complete' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'submitted_to_corpnet')}
                              title="Mark as Submitted"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here when customers place them'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersTab;
