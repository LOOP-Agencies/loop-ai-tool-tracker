import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AIEntryForm } from "@/components/AIEntryForm";
import { AIEntryCard } from "@/components/AIEntryCard";
import { StatsCards } from "@/components/StatsCards";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface AIEntry {
  id: string;
  date: string;
  prompt: string;
  aiTool: string;
  projectDetails: string;
  fileUrl: string;
}

const Index = () => {
  const [entries, setEntries] = useState<AIEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AIEntry | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTool, setFilterTool] = useState<string>("all");

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('ai-tool-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('ai-tool-entries', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (entryData: Omit<AIEntry, 'id'>) => {
    if (editingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entryData, id: editingEntry.id }
          : entry
      ));
    } else {
      // Add new entry
      const newEntry: AIEntry = {
        ...entryData,
        id: Date.now().toString()
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    setEditingEntry(undefined);
  };

  const handleEditEntry = (entry: AIEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntry(undefined);
  };

  // Get unique AI tools for filter
  const uniqueTools = [...new Set(entries.map(entry => entry.aiTool))].sort();

  // Filter entries based on search and tool filter
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.projectDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.aiTool.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterTool === "all" || entry.aiTool === filterTool;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onAddEntry={() => setShowForm(true)} />
      
      <main className="container mx-auto px-6 py-8">
        <StatsCards entries={entries} />
        
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries by prompt, project details, or AI tool..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={filterTool} onValueChange={setFilterTool}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by tool" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                {uniqueTools.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {entries.length === 0 ? "No AI entries yet" : "No matching entries"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {entries.length === 0 
                  ? "Start tracking your AI tool usage by adding your first entry."
                  : "Try adjusting your search terms or filters."
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <AIEntryCard
                key={entry.id}
                entry={entry}
                onEdit={handleEditEntry}
              />
            ))}
          </div>
        )}
      </main>

      {/* Entry Form Modal */}
      {showForm && (
        <AIEntryForm
          onClose={handleCloseForm}
          onSave={handleSaveEntry}
          entry={editingEntry}
        />
      )}
    </div>
  );
};

export default Index;
