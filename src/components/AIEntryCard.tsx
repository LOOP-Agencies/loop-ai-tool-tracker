import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ExternalLink, Calendar, Bot, FileText } from "lucide-react";

interface AIEntry {
  id: string;
  title: string;
  date: string;
  prompt: string;
  ai_tool_id: string;
  ai_tool_name?: string;
  project_details: string;
  file_url?: string;
  user_id: string;
}

interface AIEntryCardProps {
  entry: AIEntry;
  onEdit: (entry: AIEntry) => void;
}

export default function AIEntryCard({ entry, onEdit }: AIEntryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="border border-border hover:shadow-soft transition-smooth group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {entry.title}
            </h3>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="h-5 w-5 text-primary" />
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
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-smooth">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {entry.file_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(entry.file_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <h4 className="font-medium text-foreground">Prompt</h4>
          </div>
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            "{entry.prompt}"
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-foreground mb-2">Project Details</h4>
          <p className="text-sm text-muted-foreground">
            {entry.project_details}
          </p>
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
      </CardContent>
    </Card>
  );
}