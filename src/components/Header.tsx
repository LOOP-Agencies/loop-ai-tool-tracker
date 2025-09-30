import { Button } from '@/components/ui/button';
import { Plus, Settings, LogOut, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import loopLogo from "@/assets/loop-logo.png";

interface HeaderProps {
  onAddEntry: () => void;
  onShowAdmin?: () => void;
  onSignOut: () => void;
  isAdmin?: boolean;
  userName?: string;
}

export default function Header({ onAddEntry, onShowAdmin, onSignOut, isAdmin, userName }: HeaderProps) {
  const navigate = useNavigate();
  
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
            <Button onClick={onAddEntry} className="bg-loop-lime hover:bg-loop-lime/90 text-loop-charcoal">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
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