'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  messages?: any[];
}

export default function MyTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-blue-500',
      'in-progress': 'bg-yellow-500',
      resolved: 'bg-green-500',
      closed: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-500',
      medium: 'bg-blue-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const filterTickets = (status: string) => {
    if (status === 'all') return tickets;
    return tickets.filter((ticket) => ticket.status === status);
  };

  const TicketList = ({ tickets }: { tickets: Ticket[] }) => (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No tickets found
          </CardContent>
        </Card>
      ) : (
        tickets.map((ticket) => (
          <Card key={ticket.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                  <CardDescription className="mt-1">
                    {ticket.description.substring(0, 150)}
                    {ticket.description.length > 150 ? '...' : ''}
                  </CardDescription>
                </div>
                <div className="flex gap-2 ml-4">
                  <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex gap-4">
                  <span>Category: {ticket.category}</span>
                  <span>•</span>
                  <span>
                    {ticket.messages?.length || 0} {ticket.messages?.length === 1 ? 'reply' : 'replies'}
                  </span>
                </div>
                <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="py-12 text-center">Loading tickets...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Support Tickets</h1>
          <p className="text-muted-foreground mt-1">View and manage your support requests</p>
        </div>
        <Button onClick={() => router.push('/support')}>Create New Ticket</Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({tickets.length})</TabsTrigger>
          <TabsTrigger value="open">
            Open ({filterTickets('open').length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({filterTickets('in-progress').length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({filterTickets('resolved').length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({filterTickets('closed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <TicketList tickets={tickets} />
        </TabsContent>

        <TabsContent value="open" className="mt-6">
          <TicketList tickets={filterTickets('open')} />
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <TicketList tickets={filterTickets('in-progress')} />
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          <TicketList tickets={filterTickets('resolved')} />
        </TabsContent>

        <TabsContent value="closed" className="mt-6">
          <TicketList tickets={filterTickets('closed')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
