import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, X, Calendar, Bot, FileText, ExternalLink } from "lucide-react";

interface AIEntry {
  id: string;
  title: string;
  date: string;
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

interface AIEntryDetailProps {
  entry: AIEntry | null;
  onClose: () => void;
  onEdit: (entry: AIEntry) => void;
}

export default function AIEntryDetail({ entry, onClose, onEdit }: AIEntryDetailProps) {
  if (!entry) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={!!entry} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl pr-8">{entry.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(entry)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="bg-loop-lime/20 text-loop-lime mb-2">
                {entry.ai_tool_name || 'Unknown Tool'}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(entry.date)}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <h4 className="font-semibold text-foreground">Prompt</h4>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              "{entry.prompt}"
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Project Details</h4>
            <p className="text-sm text-muted-foreground">
              {entry.project_details}
            </p>
          </div>

          <div className="flex gap-4">
            {entry.conceptual_only && (
              <Badge variant="outline">Conceptual Only</Badge>
            )}
            {entry.final_used_asset && (
              <Badge variant="outline">Final Used Asset</Badge>
            )}
          </div>

          {entry.file_url && (
            <div className="pt-2 border-t border-border">
              <a
                href={entry.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 transition-smooth flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Final File
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
