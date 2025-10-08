import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Trash2, Plus, Settings, UserPlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AITool {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  is_admin: boolean;
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [tools, setTools] = useState<AITool[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTools();
    fetchUsers();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .order('name');

      if (error) throw error;
      setTools(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch AI tools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTool) {
        const { error } = await supabase
          .from('ai_tools')
          .update(formData)
          .eq('id', editingTool.id);

        if (error) throw error;
        toast({ title: "Success", description: "AI tool updated successfully" });
      } else {
        const { error } = await supabase
          .from('ai_tools')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Success", description: "AI tool created successfully" });
      }

      setShowForm(false);
      setEditingTool(null);
      setFormData({ name: '', description: '', is_active: true });
      fetchTools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tool: AITool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description || '',
      is_active: tool.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this AI tool?')) return;

    try {
      const { error } = await supabase
        .from('ai_tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "AI tool deleted successfully" });
      fetchTools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at, user_id')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = (profilesData || []).map(profile => ({
        id: profile.user_id,
        email: profile.email || '',
        full_name: profile.full_name,
        created_at: profile.created_at,
        is_admin: rolesData?.some(role => role.user_id === profile.user_id && role.role === 'admin') || false,
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userFormData.email,
        password: userFormData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userFormData.full_name,
          },
        },
      });

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: "User created successfully. They will need to verify their email." 
      });
      
      setShowUserForm(false);
      setUserFormData({ email: '', password: '', full_name: '' });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTool(null);
    setFormData({ name: '', description: '', is_active: true });
  };

  const resetUserForm = () => {
    setShowUserForm(false);
    setUserFormData({ email: '', password: '', full_name: '' });
  };

  const handleToggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
        toast({ title: "Success", description: "Admin role removed" });
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (error) throw error;
        toast({ title: "Success", description: "User promoted to admin" });
      }
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        'https://ghyxrfmmrwocnwxmgstu.supabase.co/functions/v1/delete-user',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }

      toast({ 
        title: "Success", 
        description: `User ${userName} has been deleted successfully` 
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardContent className="p-8 text-center">
            Loading...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Admin Panel</CardTitle>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tools">AI Tools</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="tools">
              <div className="flex justify-end mb-4">
                <Dialog open={showForm} onOpenChange={setShowForm}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tool
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTool ? 'Edit AI Tool' : 'Add New AI Tool'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Tool Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          {editingTool ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell className="font-medium">{tool.name}</TableCell>
                      <TableCell>{tool.description || 'No description'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tool.is_active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {tool.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(tool)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(tool.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {tools.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No AI tools found. Add some tools to get started.
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              <div className="flex justify-end mb-4">
                <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetUserForm()}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-full-name">Full Name</Label>
                        <Input
                          id="user-full-name"
                          value={userFormData.full_name}
                          onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-email">Email</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={userFormData.email}
                          onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-password">Password</Label>
                        <Input
                          id="user-password"
                          type="password"
                          value={userFormData.password}
                          onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Create User
                        </Button>
                        <Button type="button" variant="outline" onClick={resetUserForm}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={user.is_admin}
                            onCheckedChange={() => handleToggleAdmin(user.id, user.is_admin)}
                          />
                          <Label className="text-xs">{user.is_admin ? 'Admin' : 'User'}</Label>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the user account for{' '}
                                <strong>{user.full_name || user.email}</strong> and remove all their data from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}