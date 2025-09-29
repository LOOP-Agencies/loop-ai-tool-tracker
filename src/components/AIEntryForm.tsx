import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIEntry {
  id: string;
  date: string;
  prompt: string;
  aiTool: string;
  projectDetails: string;
  fileUrl: string;
}

interface AIEntryFormProps {
  onClose: () => void;
  onSave: (entry: Omit<AIEntry, 'id'>) => void;
  entry?: AIEntry;
}

const AI_TOOLS = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
  "Runway ML",
  "Copy.ai",
  "Jasper",
  "Canva AI",
  "Adobe Firefly",
  "Other"
];

export const AIEntryForm = ({ onClose, onSave, entry }: AIEntryFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: entry?.date || new Date().toISOString().split('T')[0],
    prompt: entry?.prompt || '',
    aiTool: entry?.aiTool || '',
    projectDetails: entry?.projectDetails || '',
    fileUrl: entry?.fileUrl || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim() || !formData.aiTool || !formData.projectDetails.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Entry Saved",
      description: "AI tool usage has been recorded successfully.",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-glow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {entry ? 'Edit AI Entry' : 'Add AI Tool Usage'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aiTool">AI Tool Used *</Label>
              <Select value={formData.aiTool} onValueChange={(value) => setFormData(prev => ({ ...prev, aiTool: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI tool" />
                </SelectTrigger>
                <SelectContent>
                  {AI_TOOLS.map((tool) => (
                    <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt Used *</Label>
              <Textarea
                id="prompt"
                placeholder="Enter the prompt you used with the AI tool..."
                value={formData.prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDetails">Project Details *</Label>
              <Textarea
                id="projectDetails"
                placeholder="Describe the project context and what you created..."
                value={formData.projectDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, projectDetails: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL (Optional)</Label>
              <Input
                id="fileUrl"
                type="url"
                placeholder="https://..."
                value={formData.fileUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="transition-smooth hover:shadow-glow">
                <Save className="h-4 w-4 mr-2" />
                {entry ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};