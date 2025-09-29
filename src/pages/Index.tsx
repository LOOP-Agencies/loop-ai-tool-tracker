import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import AIEntryForm from '@/components/AIEntryForm';
import AIEntryCard from '@/components/AIEntryCard';
import StatsCards from '@/components/StatsCards';
import AdminPanel from '@/components/AdminPanel';
import AuthPage from '@/components/AuthPage';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Types
interface AIEntry {
  id: string;
  date: string;
  title: string;
  prompt: string;
  ai_tool_id: string;
  ai_tool_name?: string;
  project_details: string;
  file_url?: string;
  user_id: string;
}

interface AITool {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export default function Index() {
  // State declarations - ensuring all are properly defined
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [entries, setEntries] = useState<AIEntry[]>([]);
  const [aiTools, setAITools] = useState<AITool[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<AIEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTool, setFilterTool] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  
  const { toast } = useToast();

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
            fetchEntries();
            fetchAITools();
          }, 0);
        } else {
          setIsAdmin(false);
          setEntries([]);
          setAITools([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
        fetchEntries();
        fetchAITools();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      setIsAdmin(!error && data?.role === 'admin');
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_entries')
        .select(`
          *,
          ai_tools:ai_tool_id (
            name
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      
      const entriesWithToolNames = data?.map(entry => ({
        ...entry,
        ai_tool_name: entry.ai_tools?.name || 'Unknown Tool'
      })) || [];
      
      setEntries(entriesWithToolNames);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load entries",
        variant: "destructive",
      });
    }
  };

  const fetchAITools = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAITools(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load AI tools",
        variant: "destructive",
      });
    }
  };

  const handleSaveEntry = async (entryData: Omit<AIEntry, 'id'>) => {
    try {
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('ai_entries')
          .update({
            date: entryData.date,
            title: entryData.title,
            prompt: entryData.prompt,
            ai_tool_id: entryData.ai_tool_id,
            project_details: entryData.project_details,
            file_url: entryData.file_url,
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
        setEditingEntry(null);
      } else {
        // Add new entry
        const { error } = await supabase
          .from('ai_entries')
          .insert([{
            ...entryData,
            user_id: user!.id,
          }]);

        if (error) throw error;
      }

      fetchEntries();
      setShowForm(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditEntry = (entry: AIEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Filter entries based on search term and selected tool
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.project_details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.ai_tool_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTool = filterTool === 'all' || entry.ai_tool_id === filterTool;
    
    return matchesSearch && matchesTool;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAddEntry={() => setShowForm(true)}
        onShowAdmin={isAdmin ? () => setShowAdmin(true) : undefined}
        onSignOut={handleSignOut}
        isAdmin={isAdmin}
        userName={user.user_metadata?.full_name || user.email}
      />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <StatsCards entries={entries} />
        
        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={filterTool} onValueChange={setFilterTool}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tool" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                {aiTools.map((tool) => (
                  <SelectItem key={tool.id} value={tool.id}>
                    {tool.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <AIEntryCard
              key={entry.id}
              entry={entry}
              onEdit={handleEditEntry}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {searchTerm || filterTool !== 'all' 
                ? 'No entries match your search criteria' 
                : 'No AI tool entries yet'}
            </p>
            <p className="text-muted-foreground">
              {searchTerm || filterTool !== 'all'
                ? 'Try adjusting your search or filter settings'
                : 'Click "Add Entry" to record your first AI tool usage'}
            </p>
          </div>
        )}
      </main>

      {/* Add/Edit Entry Form Modal */}
      {showForm && (
        <AIEntryForm
          onClose={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
          onSave={handleSaveEntry}
          entry={editingEntry || undefined}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdmin && isAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}