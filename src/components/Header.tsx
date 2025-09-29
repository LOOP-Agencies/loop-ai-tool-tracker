import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import loopLogo from "@/assets/loop-logo.png";

interface HeaderProps {
  onAddEntry: () => void;
}

export const Header = ({ onAddEntry }: HeaderProps) => {
  return (
    <header className="bg-background border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={loopLogo} 
              alt="LOOP Agencies" 
              className="h-10 w-auto"
            />
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">AI Tool Tracker</h1>
                <p className="text-sm text-muted-foreground">Manage your AI project workflow</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onAddEntry}
            className="transition-smooth hover:shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>
    </header>
  );
};