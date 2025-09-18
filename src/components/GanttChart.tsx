import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  startWeek: number;
  duration: number;
  status: 'planning' | 'progress' | 'review' | 'completed';
  assignee: string;
  assigneeAvatar?: string;
}

interface TaskGroup {
  id: string;
  title: string;
  activities: Activity[];
}

interface GanttChartProps {
  teamData: any[];
}

const GanttChart: React.FC<GanttChartProps> = ({ teamData }) => {
  // Generate sample data matching the reference image
  const taskGroups: TaskGroup[] = [
    {
      id: '1',
      title: 'UI/UX Design',
      activities: [
        { id: '1-1', title: 'User Research', startWeek: 0, duration: 2, status: 'completed', assignee: 'EM' },
        { id: '1-2', title: 'Wireframing', startWeek: 1, duration: 3, status: 'progress', assignee: 'EM' },
        { id: '1-3', title: 'Prototyping', startWeek: 3, duration: 4, status: 'planning', assignee: 'EM' }
      ]
    },
    {
      id: '2',
      title: 'Backend Development',
      activities: [
        { id: '2-1', title: 'API Design', startWeek: 2, duration: 2, status: 'completed', assignee: 'AL' },
        { id: '2-2', title: 'Database Setup', startWeek: 3, duration: 3, status: 'progress', assignee: 'AL' },
        { id: '2-3', title: 'Authentication', startWeek: 5, duration: 2, status: 'planning', assignee: 'MI' }
      ]
    },
    {
      id: '3',
      title: 'Frontend Development',
      activities: [
        { id: '3-1', title: 'Component Library', startWeek: 2, duration: 1, status: 'completed', assignee: 'MI' },
        { id: '3-2', title: 'Main Dashboard', startWeek: 4, duration: 3, status: 'progress', assignee: 'MI' },
        { id: '3-3', title: 'User Interface', startWeek: 6, duration: 4, status: 'planning', assignee: 'MI' },
        { id: '3-4', title: 'Integration Testing', startWeek: 8, duration: 2, status: 'planning', assignee: 'LI' }
      ]
    }
  ];

  // Generate weeks
  const generateWeeks = () => {
    const weeks = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Monday
    
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      weeks.push({
        start: weekStart,
        end: weekEnd,
        label: `${weekStart.toLocaleDateString('en', { month: 'short' })} ${weekStart.getDate()}-${weekEnd.getDate()}`
      });
    }
    return weeks;
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-500';
      case 'progress':
        return 'bg-purple-500';
      case 'review':
        return 'bg-pink-500';
      case 'planning':
        return 'bg-red-300';
      default:
        return 'bg-gray-300';
    }
  };

  const weeks = generateWeeks();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Project Gantt Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Timeline Header */}
          <div className="flex mb-4">
            <div className="w-64 flex-shrink-0"></div>
            <div className="flex-1 grid grid-cols-12 gap-1">
              {weeks.map((week, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">
                    {week.label}
                  </div>
                  <div className="grid grid-cols-5 gap-px">
                    {['M', 'T', 'W', 'T', 'F'].map((day, dayIndex) => (
                      <div key={dayIndex} className="text-xs text-center py-1 bg-muted/30 text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-16 flex-shrink-0"></div>
          </div>

          {/* Task Groups */}
          <div className="space-y-6">
            {taskGroups.map((taskGroup) => (
              <div key={taskGroup.id} className="space-y-2">
                {/* Task Group Header */}
                <div className="flex">
                  <div className="w-64 flex-shrink-0">
                    <div className="bg-foreground text-background px-3 py-2 font-semibold text-sm">
                      {taskGroup.title}
                    </div>
                  </div>
                  <div className="flex-1"></div>
                  <div className="w-16 flex-shrink-0"></div>
                </div>

                {/* Activities */}
                {taskGroup.activities.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    {/* Activity Name */}
                    <div className="w-64 flex-shrink-0 pl-4 pr-4">
                      <div className="text-sm text-muted-foreground truncate">
                        {activity.title}
                      </div>
                    </div>

                    {/* Gantt Timeline */}
                    <div className="flex-1 relative h-8">
                      <div className="absolute inset-0 grid grid-cols-12 gap-1">
                        {weeks.map((_, weekIndex) => (
                          <div key={weekIndex} className="bg-muted/10 border-r border-muted/20"></div>
                        ))}
                      </div>
                      
                      {/* Activity Bar */}
                      <div 
                        className={`absolute h-6 top-1 rounded ${getStatusColor(activity.status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                        style={{
                          left: `${(activity.startWeek / 12) * 100}%`,
                          width: `${(activity.duration / 12) * 100}%`
                        }}
                      ></div>
                    </div>

                    {/* Assignee */}
                    <div className="w-16 flex-shrink-0 flex justify-center">
                      <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-medium text-purple-800">
                        {activity.assignee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {taskGroups.length === 0 && (
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