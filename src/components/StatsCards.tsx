import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Calendar, Zap, TrendingUp } from "lucide-react";

interface AIEntry {
  id: string;
  date: string;
  prompt: string;
  aiTool: string;
  projectDetails: string;
  fileUrl: string;
}

interface StatsCardsProps {
  entries: AIEntry[];
}

export const StatsCards = ({ entries }: StatsCardsProps) => {
  const totalEntries = entries.length;
  const uniqueTools = new Set(entries.map(entry => entry.aiTool)).size;
  const thisMonth = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
  }).length;
  
  const mostUsedTool = entries.length > 0 ? 
    Object.entries(
      entries.reduce((acc, entry) => {
        acc[entry.aiTool] = (acc[entry.aiTool] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None' : 'None';

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
      value: mostUsedTool,
      description: "Most popular AI tool",
      icon: Zap,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="gradient-card border border-border hover:shadow-soft transition-smooth">
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
};