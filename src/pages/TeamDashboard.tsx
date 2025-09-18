import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, Users, CheckCircle2, Circle, Timer, BarChart3 } from 'lucide-react';
import GanttChart from '@/components/GanttChart';

import sarahAvatar from '@/assets/avatar-sarah.jpg';
import mikeAvatar from '@/assets/avatar-mike.jpg';
import emmaAvatar from '@/assets/avatar-emma.jpg';
import jamesAvatar from '@/assets/avatar-james.jpg';
import lisaAvatar from '@/assets/avatar-lisa.jpg';
import alexAvatar from '@/assets/avatar-alex.jpg';

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

const teamData: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Project Manager',
    avatar: sarahAvatar,
    availability: 'Available in 2 days',
    projects: ['Mobile App Redesign', 'Client Portal'],
    tasks: [
      { id: '1', title: 'Sprint Planning Meeting', status: 'progress', dueDate: '2024-01-15', project: 'Mobile App Redesign' },
      { id: '2', title: 'Review UI Mockups', status: 'todo', dueDate: '2024-01-16', project: 'Client Portal' },
      { id: '3', title: 'Update Project Timeline', status: 'completed', dueDate: '2024-01-12', project: 'Mobile App Redesign' },
    ],
  },
  {
    id: '2',
    name: 'Mike Chen',
    position: 'Senior Developer',
    avatar: mikeAvatar,
    availability: 'Available in 5 days',
    projects: ['Mobile App Redesign', 'API Integration'],
    tasks: [
      { id: '4', title: 'Implement User Authentication', status: 'progress', dueDate: '2024-01-17', project: 'Mobile App Redesign' },
      { id: '5', title: 'Code Review Session', status: 'todo', dueDate: '2024-01-18', project: 'API Integration' },
      { id: '6', title: 'Database Migration', status: 'completed', dueDate: '2024-01-10', project: 'API Integration' },
    ],
  },
  {
    id: '3',
    name: 'Emma Wilson',
    position: 'UI/UX Designer',
    avatar: emmaAvatar,
    availability: 'Available today',
    projects: ['Mobile App Redesign', 'Brand Guidelines'],
    tasks: [
      { id: '7', title: 'Create Design System', status: 'progress', dueDate: '2024-01-16', project: 'Mobile App Redesign' },
      { id: '8', title: 'User Research Analysis', status: 'todo', dueDate: '2024-01-19', project: 'Brand Guidelines' },
      { id: '9', title: 'Wireframe Approval', status: 'completed', dueDate: '2024-01-11', project: 'Mobile App Redesign' },
    ],
  },
  {
    id: '4',
    name: 'James Rodriguez',
    position: 'Marketing Specialist',
    avatar: jamesAvatar,
    availability: 'Available in 3 days',
    projects: ['Brand Guidelines', 'Product Launch'],
    tasks: [
      { id: '10', title: 'Campaign Strategy', status: 'progress', dueDate: '2024-01-18', project: 'Product Launch' },
      { id: '11', title: 'Content Calendar', status: 'todo', dueDate: '2024-01-20', project: 'Brand Guidelines' },
      { id: '12', title: 'Social Media Assets', status: 'completed', dueDate: '2024-01-13', project: 'Product Launch' },
    ],
  },
  {
    id: '5',
    name: 'Lisa Park',
    position: 'Data Analyst',
    avatar: lisaAvatar,
    availability: 'Available in 1 day',
    projects: ['Analytics Dashboard', 'Client Portal'],
    tasks: [
      { id: '13', title: 'Performance Metrics', status: 'progress', dueDate: '2024-01-17', project: 'Analytics Dashboard' },
      { id: '14', title: 'Data Visualization', status: 'todo', dueDate: '2024-01-21', project: 'Client Portal' },
      { id: '15', title: 'Monthly Report', status: 'completed', dueDate: '2024-01-14', project: 'Analytics Dashboard' },
    ],
  },
  {
    id: '6',
    name: 'Alex Thompson',
    position: 'Backend Developer',
    avatar: alexAvatar,
    availability: 'Available in 4 days',
    projects: ['API Integration', 'Client Portal'],
    tasks: [
      { id: '16', title: 'API Documentation', status: 'progress', dueDate: '2024-01-19', project: 'API Integration' },
      { id: '17', title: 'Server Optimization', status: 'todo', dueDate: '2024-01-22', project: 'Client Portal' },
      { id: '18', title: 'Security Audit', status: 'completed', dueDate: '2024-01-09', project: 'API Integration' },
    ],
  },
];

type TimePeriod = 'daily' | 'weekly' | 'monthly';

const TeamDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('weekly');

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'progress':
        return <Timer className="h-4 w-4" />;
      case 'todo':
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-status-completed text-status-completed-foreground';
      case 'progress':
        return 'bg-status-progress text-status-progress-foreground';
      case 'todo':
        return 'bg-status-todo text-status-todo-foreground';
    }
  };

  const calculateProgress = (tasks: Task[]) => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  };

  const getTaskCounts = (tasks: Task[]) => {
    return {
      todo: tasks.filter(task => task.status === 'todo').length,
      progress: tasks.filter(task => task.status === 'progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
    };
  };

  return (
    <div className="min-h-screen bg-dashboard-content">
      {/* Header */}
      <div className="bg-dashboard-header border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Team Dashboard</h1>
            </div>
            
            {/* Period Filter */}
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as TimePeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Task Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamData.length}</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamData.reduce((acc, member) => acc + member.tasks.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Availability</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamData.filter(member => member.availability.includes('today')).length}
              </div>
              <p className="text-xs text-muted-foreground">Available today</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamData.map((member) => {
            const taskCounts = getTaskCounts(member.tasks);
            const progress = calculateProgress(member.tasks);
            
            return (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{member.availability}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Task Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {/* Task Status */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Task Status</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={`${getStatusColor('todo')} text-xs`}>
                        {getStatusIcon('todo')}
                        <span className="ml-1">To Do: {taskCounts.todo}</span>
                      </Badge>
                      <Badge className={`${getStatusColor('progress')} text-xs`}>
                        {getStatusIcon('progress')}
                        <span className="ml-1">In Progress: {taskCounts.progress}</span>
                      </Badge>
                      <Badge className={`${getStatusColor('completed')} text-xs`}>
                        {getStatusIcon('completed')}
                        <span className="ml-1">Completed: {taskCounts.completed}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Projects */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Active Projects</h4>
                    <div className="space-y-1">
                      {member.projects.map((project, index) => (
                        <div key={index} className="text-xs bg-muted px-2 py-1 rounded">
                          {project}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Tasks */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Tasks</h4>
                    <div className="space-y-2">
                      {member.tasks.slice(0, 2).map((task) => (
                        <div key={task.id} className="flex items-center gap-2 text-xs">
                          <div className={`p-1 rounded ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-muted-foreground">Due: {task.dueDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
          </TabsContent>

          <TabsContent value="timeline">
            <GanttChart teamData={teamData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamDashboard;