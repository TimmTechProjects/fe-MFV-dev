'use client';

import { useState, useEffect } from 'react';
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

export default function ReportBugPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [browserInfo, setBrowserInfo] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stepsToReproduce: '',
    severity: 'medium',
  });

  useEffect(() => {
    // Capture browser information
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };
    setBrowserInfo(JSON.stringify(info, null, 2));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/bugs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          browserInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bug report');
      }

      toast({
        title: 'Bug Report Submitted',
        description: 'Thank you for helping us improve! We'll investigate this issue.',
      });

      setFormData({
        title: '',
        description: '',
        stepsToReproduce: '',
        severity: 'medium',
      });
      router.push('/');
    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit bug report. Please try again.',
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
          <CardTitle className="text-2xl">🐛 Report a Bug</CardTitle>
          <CardDescription>
            Found something not working as expected? Let us know so we can fix it!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Bug Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the bug"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                  <SelectItem value="medium">Medium - Affects some functionality</SelectItem>
                  <SelectItem value="high">High - Major feature broken</SelectItem>
                  <SelectItem value="critical">Critical - App unusable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">What happened?</Label>
              <Textarea
                id="description"
                placeholder="Describe the bug and what you expected to happen instead..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
              <Textarea
                id="stepsToReproduce"
                placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                value={formData.stepsToReproduce}
                onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Help us reproduce the bug by providing detailed steps
              </p>
            </div>

            <div className="space-y-2">
              <Label>Browser Information</Label>
              <div className="bg-muted p-3 rounded-md">
                <pre className="text-xs overflow-auto">{browserInfo}</pre>
              </div>
              <p className="text-xs text-muted-foreground">
                This information will be automatically included with your report
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Bug Report'}
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
          <CardTitle>Tips for Effective Bug Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h4 className="font-semibold">Be Specific</h4>
              <p className="text-sm text-muted-foreground">
                Include exact error messages, page URLs, and what you were trying to do
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📸</span>
            <div>
              <h4 className="font-semibold">Screenshots Help</h4>
              <p className="text-sm text-muted-foreground">
                If possible, take a screenshot showing the issue (you can attach it in follow-up)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <h4 className="font-semibold">Can You Reproduce It?</h4>
              <p className="text-sm text-muted-foreground">
                Try to reproduce the bug and document the exact steps - this helps us fix it faster
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
