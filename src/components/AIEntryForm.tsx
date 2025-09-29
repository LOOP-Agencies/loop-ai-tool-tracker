import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Types
interface AIEntry {
  id: string;
  date: string;
  title: string;
  prompt: string;
  ai_tool_id: string;
  project_details: string;
  file_url?: string;
}

interface AITool {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

interface AIEntryFormProps {
  onClose: () => void;
  onSave: (entry: Omit<AIEntry, 'id'>) => void;
  entry?: AIEntry;
}

export default function AIEntryForm({ onClose, onSave, entry }: AIEntryFormProps) {
  const [aiTools, setAITools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: entry?.date || new Date().toISOString().split('T')[0],
    title: entry?.title || '',
    prompt: entry?.prompt || '',
    ai_tool_id: entry?.ai_tool_id || '',
    project_details: entry?.project_details || '',
    file_url: entry?.file_url || '',
    additional_tools: [] as string[],
  });
  const [loopToolsAgreement, setLoopToolsAgreement] = useState<boolean>(false);
  const [selectedAdditionalTool, setSelectedAdditionalTool] = useState<string>('');

  useEffect(() => {
    fetchAITools();
  }, []);

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
      toast.error('Failed to load AI tools');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.date || !formData.title || !formData.prompt || !formData.ai_tool_id || !formData.project_details || !formData.file_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!loopToolsAgreement) {
      toast.error('Please confirm that you are using approved LOOP tools');
      return;
    }

    // Save the entry
    onSave({
      date: formData.date,
      title: formData.title,
      prompt: formData.prompt,
      ai_tool_id: formData.ai_tool_id,
      project_details: formData.project_details,
      file_url: formData.file_url || undefined,
    });

    toast.success(entry ? 'Entry updated successfully!' : 'Entry added successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiTool">AI Tool *</Label>
                <Select 
                  value={formData.ai_tool_id} 
                  onValueChange={(value) => setFormData({ ...formData, ai_tool_id: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Loading tools..." : "Select an AI tool"} />
                  </SelectTrigger>
                  <SelectContent>
                    {aiTools.map((tool) => (
                      <SelectItem key={tool.id} value={tool.id}>
                        {tool.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a title for this entry..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDetails">Project Details *</Label>
              <Textarea
                id="projectDetails"
                value={formData.project_details}
                onChange={(e) => setFormData({ ...formData, project_details: e.target.value })}
                placeholder="Describe the project context and how the AI tool was used..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt Used *</Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="Enter the prompt you used with the AI tool..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalTools">Additional Tools Used</Label>
              <div className="flex gap-2">
                <Select 
                  value={selectedAdditionalTool} 
                  onValueChange={setSelectedAdditionalTool}
                  disabled={loading}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={loading ? "Loading tools..." : "Select additional tool"} />
                  </SelectTrigger>
                  <SelectContent>
                    {aiTools
                      .filter(tool => !formData.additional_tools.includes(tool.id) && tool.id !== formData.ai_tool_id)
                      .map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedAdditionalTool && !formData.additional_tools.includes(selectedAdditionalTool)) {
                      setFormData({
                        ...formData,
                        additional_tools: [...formData.additional_tools, selectedAdditionalTool],
                      });
                      setSelectedAdditionalTool('');
                    }
                  }}
                  disabled={!selectedAdditionalTool}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.additional_tools.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.additional_tools.map((toolId) => {
                    const tool = aiTools.find(t => t.id === toolId);
                    return (
                      <Badge key={toolId} variant="secondary" className="flex items-center gap-1">
                        {tool?.name}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              additional_tools: formData.additional_tools.filter(id => id !== toolId),
                            });
                          }}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL *</Label>
              <Input
                id="fileUrl"
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="https://example.com/final-file"
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="loopAgreement"
                checked={loopToolsAgreement}
                onCheckedChange={(checked) => setLoopToolsAgreement(checked as boolean)}
              />
              <Label htmlFor="loopAgreement" className="text-sm leading-relaxed">
                Please ensure you only use approved LOOP tools and are logged in through the LOOP logins not any personal accounts
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {entry ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}