import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";

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
  user_name?: string;
}

interface AIEntryListItemProps {
  entry: AIEntry;
  onClick: (entry: AIEntry) => void;
}

export default function AIEntryListItem({ entry, onClick }: AIEntryListItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-soft transition-smooth group bg-card cursor-pointer"
      onClick={() => onClick(entry)}
    >
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[120px]">
          <Calendar className="h-4 w-4" />
          {formatDate(entry.date)}
        </div>
        
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">
            {entry.title}
          </h3>
          {entry.user_name && (
            <p className="text-xs text-muted-foreground mt-1">
              Submitted by {entry.user_name}
            </p>
          )}
        </div>
        
        <Badge variant="secondary" className="bg-loop-lime/20 text-loop-lime">
          {entry.ai_tool_name || 'Unknown Tool'}
        </Badge>
        
        {entry.file_url && (
          <a
            href={entry.file_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-primary hover:text-primary/80 transition-smooth"
            title="View final file"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
