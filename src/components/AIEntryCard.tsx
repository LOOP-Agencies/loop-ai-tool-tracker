import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bot, FileText } from "lucide-react";

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
}

interface AIEntryCardProps {
  entry: AIEntry;
  onClick: (entry: AIEntry) => void;
}

export default function AIEntryCard({ entry, onClick }: AIEntryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="border border-border hover:shadow-soft transition-smooth group cursor-pointer"
      onClick={() => onClick(entry)}
    >
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
        
      </CardContent>
    </Card>
  );
}