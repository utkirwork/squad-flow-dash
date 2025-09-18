import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Timer, Circle, Calendar, CheckCircle2 } from 'lucide-react';

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
  // Get all tasks with enhanced timeline data
  const getAllTasksWithTimeline = () => {
    const today = new Date();
    const tasks: Array<Task & { 
      memberName: string; 
      memberAvatar: string; 
      startDate: Date;
      endDate: Date;
      progress: number;
      position: number;
    }> = [];
    
    teamData.forEach((member, memberIndex) => {
      member.tasks.forEach((task, taskIndex) => {
        const endDate = new Date(task.dueDate);
        // Assume tasks start 7 days before due date for demo purposes
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
        
        // Calculate progress based on status
        let progress = 0;
        if (task.status === 'completed') progress = 100;
        else if (task.status === 'progress') progress = 60;
        else progress = 0;
        
        tasks.push({
          ...task,
          memberName: member.name,
          memberAvatar: member.avatar,
          startDate,
          endDate,
          progress,
          position: memberIndex * 3 + taskIndex // For vertical positioning
        });
      });
    });
    
    return tasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  };

  // Generate timeline dates (showing 3 weeks)
  const generateTimelineDates = () => {
    const dates = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Start a week ago
    
    for (let i = 0; i < 21; i++) { // 3 weeks
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-status-completed';
      case 'progress':
        return 'bg-status-progress';
      case 'todo':
        return 'bg-status-todo';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'progress':
        return <Timer className="h-3 w-3" />;
      case 'todo':
        return <Circle className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  // Calculate position and width of task bars in the timeline
  const getTaskBarStyle = (startDate: Date, endDate: Date, timelineDates: Date[]) => {
    const timelineStart = timelineDates[0];
    const timelineEnd = timelineDates[timelineDates.length - 1];
    const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    
    const taskStartDays = Math.max(0, Math.ceil((startDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)));
    const taskDurationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const leftPercent = (taskStartDays / totalDays) * 100;
    const widthPercent = (taskDurationDays / totalDays) * 100;
    
    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 2)}%` // Minimum 2% width for visibility
    };
  };

  const allTasks = getAllTasksWithTimeline();
  const timelineDates = generateTimelineDates();
  const today = new Date();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Gantt Chart - Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline Header - Dates */}
          <div className="flex mb-4">
            <div className="w-64 flex-shrink-0"></div> {/* Space for task info */}
            <div className="flex-1 grid grid-cols-21 gap-1">
              {timelineDates.map((date, index) => (
                <div key={index} className="text-xs text-center p-1">
                  <div className="font-medium">{date.getDate()}</div>
                  <div className="text-muted-foreground">
                    {date.toLocaleDateString('en', { month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today indicator line */}
          <div className="relative mb-4">
            <div className="flex">
              <div className="w-64 flex-shrink-0"></div>
              <div className="flex-1 relative">
                {(() => {
                  const todayIndex = timelineDates.findIndex(date => 
                    date.toDateString() === today.toDateString()
                  );
                  if (todayIndex >= 0) {
                    const leftPercent = (todayIndex / timelineDates.length) * 100;
                    return (
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
                        style={{ left: `${leftPercent}%` }}
                      >
                        <div className="absolute -top-2 -left-6 text-xs text-destructive font-medium">
                          Today
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="space-y-3">
            {allTasks.map((task) => {
              const barStyle = getTaskBarStyle(task.startDate, task.endDate, timelineDates);
              
              return (
                <div key={task.id} className="flex items-center">
                  {/* Task Info */}
                  <div className="w-64 flex-shrink-0 flex items-center gap-3 pr-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.memberAvatar} alt={task.memberName} />
                      <AvatarFallback className="text-xs">
                        {task.memberName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{task.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{task.memberName}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {getStatusIcon(task.status)}
                        <span className="text-xs">{task.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gantt Bar */}
                  <div className="flex-1 relative h-8">
                    <div className="absolute inset-0 bg-muted/20 rounded"></div>
                    <div 
                      className={`absolute h-full rounded ${getStatusColor(task.status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                      style={barStyle}
                    >
                      {/* Progress indicator */}
                      <div 
                        className="h-full bg-white/30 rounded-l"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                      
                      {/* Task label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white drop-shadow-sm truncate px-2">
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {allTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks to display in timeline</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;