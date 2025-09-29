import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Calendar, Zap, TrendingUp } from "lucide-react";

interface AIEntry {
  id: string;
  date: string;
  prompt: string;
  ai_tool_id: string;
  ai_tool_name?: string;
  project_details: string;
  file_url?: string;
  user_id: string;
}

interface StatsCardsProps {
  entries: AIEntry[];
}

export default function StatsCards({ entries }: StatsCardsProps) {
  // Calculate statistics
  const totalEntries = entries.length;
  const uniqueTools = new Set(entries.map(entry => entry.ai_tool_name).filter(Boolean)).size;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonth = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  }).length;

  // Find most used tool
  const toolCounts = entries.reduce((acc, entry) => {
    const toolName = entry.ai_tool_name || 'Unknown';
    acc[toolName] = (acc[toolName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedTool = Object.entries(toolCounts).reduce((max, [tool, count]) => {
    return count > max.count ? { tool, count } : max;
  }, { tool: 'None', count: 0 });

  const stats = [
    {
      title: "Total Entries",
      value: totalEntries.toString(),
      description: "AI tool usage records",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Unique Tools",
      value: uniqueTools.toString(),
      description: "Different AI tools used",
      icon: Bot,
      color: "text-primary"
    },
    {
      title: "This Month",
      value: thisMonth.toString(),
      description: "Entries added this month",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Most Used",
      value: mostUsedTool.tool,
      description: `Used ${mostUsedTool.count} times`,
      icon: Zap,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-border hover:shadow-soft transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}