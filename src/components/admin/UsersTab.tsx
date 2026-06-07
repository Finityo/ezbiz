import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Shield, ShieldCheck, UserPlus, Trash2, Loader2 } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

const UsersTab = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [adding, setAdding] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<UserRole | null>(null);
  const [removing, setRemoving] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data: rolesData, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile info for each user
      const enriched = await Promise.all(
        (rolesData || []).map(async (r) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', r.user_id)
            .maybeSingle();

          // Try to get email from orders table as fallback
          const { data: order } = await supabase
            .from('orders')
            .select('email')
            .eq('user_id', r.user_id)
            .limit(1)
            .maybeSingle();

          return {
            ...r,
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            email: order?.email || r.user_id.slice(0, 8) + '...',
          } as UserRole;
        })
      );

      setRoles(enriched);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({ title: 'Error', description: 'Failed to fetch user roles.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const newRoleValue = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRoleValue })
        .eq('user_id', userId);

      if (error) throw error;

      setRoles(prev => prev.map(r => r.user_id === userId ? { ...r, role: newRoleValue as 'admin' | 'user' } : r));
      toast({ title: 'Role Updated', description: `User role changed to ${newRoleValue}.` });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({ title: 'Error', description: 'Failed to update role.', variant: 'destructive' });
    }
  };

  const handleAddRole = async () => {
    if (!newEmail.trim()) return;
    setAdding(true);
    try {
      // Look up user by email in profiles or orders
      const { data: orderMatch } = await supabase
        .from('orders')
        .select('user_id')
        .eq('email', newEmail.trim())
        .limit(1)
        .maybeSingle();

      const userId = orderMatch?.user_id;
      if (!userId) {
        toast({ title: 'User Not Found', description: 'No user found with that email. They must sign up first.', variant: 'destructive' });
        setAdding(false);
        return;
      }

      // Check if role already exists
      const existing = roles.find(r => r.user_id === userId);
      if (existing) {
        toast({ title: 'Already Exists', description: 'This user already has a role assigned.', variant: 'destructive' });
        setAdding(false);
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      toast({ title: 'Role Added', description: `${newRole} role assigned to ${newEmail}.` });
      setAddDialogOpen(false);
      setNewEmail('');
      setNewRole('user');
      fetchRoles();
    } catch (error) {
      console.error('Error adding role:', error);
      toast({ title: 'Error', description: 'Failed to add role.', variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  const filtered = roles.filter(r => {
    const matchesSearch = searchTerm
      ? (r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.user_id.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    const matchesRole = roleFilter === 'all' || r.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {roles.filter(r => r.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {roles.filter(r => r.role === 'user').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg">User Roles</CardTitle>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Add Role</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">User</TableHead>
                    <TableHead className="min-w-[100px]">Role</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[120px]">Joined</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm truncate max-w-[200px]">
                              {r.first_name && r.last_name
                                ? `${r.first_name} ${r.last_name}`
                                : r.email}
                            </p>
                            {r.first_name && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{r.email}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={r.role === 'admin' ? 'default' : 'secondary'}>
                            {r.role === 'admin' ? (
                              <><ShieldCheck className="h-3 w-3 mr-1" /> Admin</>
                            ) : (
                              <><Shield className="h-3 w-3 mr-1" /> User</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateRole(r.user_id, r.role)}
                              className="text-xs"
                            >
                              {r.role === 'admin' ? 'Demote' : 'Promote'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setRemoveTarget(r)}
                              className="text-xs"
                              title="Remove user"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">User Email</label>
              <Input
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">User must have an existing account.</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Role</label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as 'admin' | 'user')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRole} disabled={adding || !newEmail.trim()}>
              {adding ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <UserPlus className="h-4 w-4 mr-1" />}
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
