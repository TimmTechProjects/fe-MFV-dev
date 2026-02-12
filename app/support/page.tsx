'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/lib/hooks/use-toast';

export default function SupportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      toast({
        title: 'Ticket Created',
        description: 'Your support ticket has been submitted successfully.',
      });

      router.push('/support/my-tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to create support ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Support Ticket</CardTitle>
          <CardDescription>
            Need help? Submit a support ticket and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account & Billing</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="content">Content Moderation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your issue..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={8}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/support/my-tickets')}
              >
                View My Tickets
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Other Ways to Get Help</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">💡 Have a Suggestion?</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Share your ideas for new features or improvements
            </p>
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/feedback')}>
              Submit Feedback →
            </Button>
          </div>
          <div>
            <h3 className="font-semibold mb-1">🐛 Found a Bug?</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Report technical issues or unexpected behavior
            </p>
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push('/report-bug')}
            >
              Report Bug →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
