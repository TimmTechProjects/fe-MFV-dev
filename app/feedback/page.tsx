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

export default function FeedbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your suggestion! We appreciate your input.',
      });

      setFormData({ title: '', description: '', category: '' });
      router.push('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
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
          <CardTitle className="text-2xl">💡 Share Your Ideas</CardTitle>
          <CardDescription>
            Have a suggestion for new features or improvements? We'd love to hear from you!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Suggestion Title</Label>
              <Input
                id="title"
                placeholder="Brief title for your suggestion"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <SelectItem value="feature">New Feature</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="ui-ux">UI/UX Enhancement</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your suggestion in detail. What problem does it solve? How would it improve the experience?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={8}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Suggestion'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <h4 className="font-semibold">Review</h4>
              <p className="text-sm text-muted-foreground">
                Our team will review your suggestion and assess its feasibility
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <span className="text-lg">👍</span>
            </div>
            <div>
              <h4 className="font-semibold">Community Voting</h4>
              <p className="text-sm text-muted-foreground">
                Popular suggestions may be voted on by the community
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <span className="text-lg">🚀</span>
            </div>
            <div>
              <h4 className="font-semibold">Implementation</h4>
              <p className="text-sm text-muted-foreground">
                Approved suggestions will be added to our development roadmap
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
