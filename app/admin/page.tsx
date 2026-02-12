'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/lib/hooks/use-toast';

interface Stats {
  tickets: { open: number; resolved: number; total: number };
  suggestions: { pending: number; approved: number };
  bugs: { new: number; resolved: number };
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  userId: string;
  createdAt: string;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: number;
  createdAt: string;
}

interface BugReport {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, ticketsRes, suggestionsRes, bugsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/admin/stats`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/tickets?all=true`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/suggestions`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/bugs`, { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ticketsRes.ok) setTickets(await ticketsRes.json());
      if (suggestionsRes.ok) setSuggestions(await suggestionsRes.json());
      if (bugsRes.ok) setBugs(await bugsRes.json());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/support/tickets/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast({ title: 'Ticket updated', description: `Status changed to ${status}` });
        fetchData();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const updateSuggestionStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/support/suggestions/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast({ title: 'Suggestion updated', description: `Status changed to ${status}` });
        fetchData();
      }
    } catch (error) {
      console.error('Error updating suggestion:', error);
    }
  };

  const updateBugStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/support/bugs/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast({ title: 'Bug report updated', description: `Status changed to ${status}` });
        fetchData();
      }
    } catch (error) {
      console.error('Error updating bug report:', error);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-7xl py-8">
        <Card>
          <CardContent className="py-12 text-center">Loading dashboard...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage support tickets, suggestions, and bug reports</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Active support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Open</span>
                  <span className="font-bold text-blue-600">{stats.tickets.open}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Resolved</span>
                  <span className="font-bold text-green-600">{stats.tickets.resolved}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="font-bold">{stats.tickets.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
              <CardDescription>User feedback & ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-bold text-yellow-600">{stats.suggestions.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="font-bold text-green-600">{stats.suggestions.approved}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bug Reports</CardTitle>
              <CardDescription>Issues & technical problems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New</span>
                  <span className="font-bold text-red-600">{stats.bugs.new}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Resolved</span>
                  <span className="font-bold text-green-600">{stats.bugs.resolved}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Tickets ({tickets.length})</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions ({suggestions.length})</TabsTrigger>
          <TabsTrigger value="bugs">Bug Reports ({bugs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-6">
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                      <CardDescription className="mt-1">
                        {ticket.description.substring(0, 150)}...
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge>{ticket.priority}</Badge>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </div>
                    <Select
                      value={ticket.status}
                      onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {suggestion.description.substring(0, 150)}...
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge>👍 {suggestion.votes}</Badge>
                      <Badge variant="outline">{suggestion.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}
                    </div>
                    <Select
                      value={suggestion.status}
                      onValueChange={(value) => updateSuggestionStatus(suggestion.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bugs" className="mt-6">
          <div className="space-y-4">
            {bugs.map((bug) => (
              <Card key={bug.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{bug.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {bug.description.substring(0, 150)}...
                      </CardDescription>
                    </div>
                    <Badge
                      variant={bug.severity === 'critical' || bug.severity === 'high' ? 'destructive' : 'default'}
                    >
                      {bug.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
                    </div>
                    <Select
                      value={bug.status}
                      onValueChange={(value) => updateBugStatus(bug.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="wontfix">Won't Fix</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
