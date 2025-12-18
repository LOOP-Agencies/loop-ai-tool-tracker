import { Button } from '@/components/ui/button';
import { Plus, Settings, LogOut, BarChart3, ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import loopLogo from "@/assets/loop-logo.png";

interface AIEntry {
  id: string;
  date: string;
  title: string;
  prompt: string;
  ai_tool_id: string;
  ai_tool_name?: string;
  project_details: string;
  conceptual_only: boolean;
  final_used_asset: boolean;
  file_url?: string;
  user_id: string;
  user_name?: string;
}

interface HeaderProps {
  onAddEntry: () => void;
  onShowAdmin?: () => void;
  onSignOut: () => void;
  isAdmin?: boolean;
  userName?: string;
  showBackToEntries?: boolean;
  entries?: AIEntry[];
}

export default function Header({ onAddEntry, onShowAdmin, onSignOut, isAdmin, userName, showBackToEntries, entries = [] }: HeaderProps) {
  const navigate = useNavigate();

  const exportToCSV = () => {
    if (entries.length === 0) return;

    const headers = ['Date', 'Title', 'AI Tool', 'Project Details', 'Prompt', 'Conceptual Only', 'Final Used Asset', 'User', 'File URL'];
    
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        entry.date,
        `"${(entry.title || '').replace(/"/g, '""')}"`,
        `"${(entry.ai_tool_name || '').replace(/"/g, '""')}"`,
        `"${(entry.project_details || '').replace(/"/g, '""')}"`,
        `"${(entry.prompt || '').replace(/"/g, '""')}"`,
        entry.conceptual_only ? 'Yes' : 'No',
        entry.final_used_asset ? 'Yes' : 'No',
        `"${(entry.user_name || '').replace(/"/g, '""')}"`,
        entry.file_url || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-entries-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={loopLogo} 
              alt="LOOP Agencies" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI Tool Tracker</h1>
              <p className="text-sm text-muted-foreground">Manage your AI project workflow</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {userName && (
              <span className="text-sm text-muted-foreground">
                Welcome, {userName}
              </span>
            )}
            {showBackToEntries ? (
              <Button variant="outline" onClick={onAddEntry}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Entries
              </Button>
            ) : (
              <>
                <Button onClick={onAddEntry} className="bg-loop-lime hover:bg-loop-lime/90 text-loop-charcoal">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                {entries.length > 0 && (
                  <Button variant="outline" onClick={exportToCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </>
            )}
            {isAdmin && onShowAdmin && (
              <Button variant="outline" onClick={onShowAdmin}>
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            <Button variant="outline" onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}