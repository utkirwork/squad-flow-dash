import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Timer, Circle, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'progress' | 'completed';
  dueDate: string;
  project: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar: string;
  tasks: Task[];
  projects: string[];
  availability: string;
}

interface GanttChartProps {
  teamData: TeamMember[];
}

const GanttChart: React.FC<GanttChartProps> = ({ teamData }) => {
  // Get uncompleted tasks with timeline data
  const getUncompletedTasks = () => {
    const today = new Date();
    const tasks: Array<Task & { memberName: string; memberAvatar: string; daysUntilDue: number; isOverdue: boolean }> = [];
    
    teamData.forEach(member => {
      member.tasks
        .filter(task => task.status !== 'completed')
        .forEach(task => {
          const dueDate = new Date(task.dueDate);
          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const isOverdue = daysUntilDue < 0;
          
          tasks.push({
            ...task,
            memberName: member.name,
            memberAvatar: member.avatar,
            daysUntilDue,
            isOverdue
          });
        });
    });
    
    return tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'progress':
        return 'bg-status-progress text-status-progress-foreground';
      case 'todo':
        return 'bg-status-todo text-status-todo-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'progress':
        return <Timer className="h-3 w-3" />;
      case 'todo':
        return <Circle className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const getTimelineBar = (daysUntilDue: number, isOverdue: boolean) => {
    const maxDays = 15; // Show timeline for next 15 days
    const width = Math.min(Math.abs(daysUntilDue), maxDays) * (100 / maxDays);
    
    if (isOverdue) {
      return `bg-destructive w-full`;
    } else if (daysUntilDue <= 3) {
      return `bg-warning w-[${Math.max(width, 20)}%]`;
    } else {
      return `bg-primary w-[${width}%]`;
    }
  };

  const uncompletedTasks = getUncompletedTasks();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Task Timeline - Uncompleted Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Header */}
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium border-b pb-2">
            <div className="col-span-3">Task & Assignee</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-3">Timeline</div>
          </div>

          {/* Task Rows */}
          <div className="space-y-3">
            {uncompletedTasks.map((task) => (
              <div key={task.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                {/* Task & Assignee */}
                <div className="col-span-3 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.memberAvatar} alt={task.memberName} />
                    <AvatarFallback className="text-xs">
                      {task.memberName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm truncate">{task.title}</div>
                    <div className="text-xs text-muted-foreground">{task.memberName}</div>
                  </div>
                </div>

                {/* Project */}
                <div className="col-span-2">
                  <div className="text-xs bg-muted px-2 py-1 rounded truncate">
                    {task.project}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Badge className={`${getStatusColor(task.status)} text-xs flex items-center gap-1 w-fit`}>
                    {getStatusIcon(task.status)}
                    <span className="capitalize">{task.status === 'progress' ? 'In Progress' : 'To Do'}</span>
                  </Badge>
                </div>

                {/* Due Date */}
                <div className="col-span-2">
                  <div className={`text-sm ${task.isOverdue ? 'text-destructive font-medium' : task.daysUntilDue <= 3 ? 'text-warning font-medium' : 'text-foreground'}`}>
                    {task.dueDate}
                  </div>
                  <div className={`text-xs ${task.isOverdue ? 'text-destructive' : task.daysUntilDue <= 3 ? 'text-warning' : 'text-muted-foreground'}`}>
                    {task.isOverdue 
                      ? `${Math.abs(task.daysUntilDue)} days overdue`
                      : task.daysUntilDue === 0 
                        ? 'Due today'
                        : `${task.daysUntilDue} days left`
                    }
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="col-span-3">
                  <div className="relative">
                    <div className="w-full bg-muted h-6 rounded-lg overflow-hidden">
                      <div className={`h-full rounded-lg transition-all duration-300 ${getTimelineBar(task.daysUntilDue, task.isOverdue)}`}></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {task.isOverdue ? 'OVERDUE' : task.daysUntilDue <= 3 ? 'URGENT' : `${task.daysUntilDue}d`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {uncompletedTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>All tasks are completed! Great work! 🎉</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;