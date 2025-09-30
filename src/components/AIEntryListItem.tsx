import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Calendar } from "lucide-react";

interface AIEntry {
  id: string;
  title: string;
  date: string;
  ai_tool_name?: string;
  prompt: string;
  ai_tool_id: string;
  project_details: string;
  conceptual_only: boolean;
  final_used_asset: boolean;
  file_url?: string;
  user_id: string;
}

interface AIEntryListItemProps {
  entry: AIEntry;
  onEdit: (entry: AIEntry) => void;
}

export default function AIEntryListItem({ entry, onEdit }: AIEntryListItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-soft transition-smooth group bg-card">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[120px]">
          <Calendar className="h-4 w-4" />
          {formatDate(entry.date)}
        </div>
        
        <h3 className="text-base font-semibold text-foreground flex-1">
          {entry.title}
        </h3>
        
        <Badge variant="secondary" className="bg-loop-lime/20 text-loop-lime">
          {entry.ai_tool_name || 'Unknown Tool'}
        </Badge>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(entry)}
        className="opacity-0 group-hover:opacity-100 transition-smooth"
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
}
