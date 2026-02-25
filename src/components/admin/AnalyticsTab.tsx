import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { MousePointerClick, ScrollText, Eye, TrendingUp } from 'lucide-react';

interface ClickRecord {
  id: string;
  button_label: string;
  button_type: string;
  destination_url: string;
  page_location: string;
  clicked_at: string;
  session_id: string | null;
}

interface ScrollRecord {
  id: string;
  page_location: string;
  scroll_depth: number;
  max_scroll_reached: number;
  time_on_page: number;
  session_id: string | null;
  created_at: string | null;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(142 76% 36%)',
  'hsl(38 92% 50%)',
  'hsl(280 65% 60%)',
  'hsl(200 80% 50%)',
  'hsl(350 70% 55%)',
  'hsl(170 60% 45%)',
];

const AnalyticsTab = () => {
  const [clicks, setClicks] = useState<ClickRecord[]>([]);
  const [scrolls, setScrolls] = useState<ScrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - parseInt(dateRange));
    const sinceISO = since.toISOString();

    const [clickRes, scrollRes] = await Promise.all([
      supabase.from('click_analytics').select('*').gte('clicked_at', sinceISO).order('clicked_at', { ascending: false }),
      supabase.from('scroll_analytics').select('*').gte('created_at', sinceISO).order('created_at', { ascending: false }),
    ]);

    setClicks(clickRes.data || []);
    setScrolls(scrollRes.data || []);
    setLoading(false);
  };

  // Unique sessions
  const uniqueClickSessions = new Set(clicks.map(c => c.session_id).filter(Boolean)).size;
  const uniqueScrollSessions = new Set(scrolls.map(s => s.session_id).filter(Boolean)).size;

  // Clicks by button label
  const clicksByLabel = clicks.reduce<Record<string, number>>((acc, c) => {
    acc[c.button_label] = (acc[c.button_label] || 0) + 1;
    return acc;
  }, {});
  const clicksByLabelData = Object.entries(clicksByLabel)
    .map(([name, value]) => ({ name: name.length > 25 ? name.slice(0, 25) + '…' : name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Clicks by page
  const clicksByPage = clicks.reduce<Record<string, number>>((acc, c) => {
    acc[c.page_location] = (acc[c.page_location] || 0) + 1;
    return acc;
  }, {});
  const clicksByPageData = Object.entries(clicksByPage)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Scroll depth by page (average)
  const scrollByPage = scrolls.reduce<Record<string, { total: number; count: number; timeTotal: number }>>((acc, s) => {
    if (!acc[s.page_location]) acc[s.page_location] = { total: 0, count: 0, timeTotal: 0 };
    acc[s.page_location].total += s.max_scroll_reached;
    acc[s.page_location].timeTotal += s.time_on_page;
    acc[s.page_location].count += 1;
    return acc;
  }, {});
  const scrollByPageData = Object.entries(scrollByPage)
    .map(([name, v]) => ({
      name,
      avgScroll: Math.round(v.total / v.count),
      avgTime: Math.round(v.timeTotal / v.count),
      views: v.count,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Clicks over time (daily)
  const clicksByDay = clicks.reduce<Record<string, number>>((acc, c) => {
    const day = c.clicked_at.slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const scrollsByDay = scrolls.reduce<Record<string, number>>((acc, s) => {
    const day = (s.created_at || '').slice(0, 10);
    if (day) acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const allDays = [...new Set([...Object.keys(clicksByDay), ...Object.keys(scrollsByDay)])].sort();
  const dailyData = allDays.map(day => ({
    date: day.slice(5), // MM-DD
    clicks: clicksByDay[day] || 0,
    pageViews: scrollsByDay[day] || 0,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Site Analytics</h2>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-primary" />
              CTA Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clicks.length}</div>
            <p className="text-xs text-muted-foreground">{uniqueClickSessions} unique sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scrolls.length}</div>
            <p className="text-xs text-muted-foreground">{uniqueScrollSessions} unique sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-primary" />
              Avg Scroll Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scrolls.length > 0 ? Math.round(scrolls.reduce((s, r) => s + r.max_scroll_reached, 0) / scrolls.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">across all pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Avg Time on Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scrolls.length > 0 ? Math.round(scrolls.reduce((s, r) => s + r.time_on_page, 0) / scrolls.length) : 0}s
            </div>
            <p className="text-xs text-muted-foreground">average engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      {dailyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
            <CardDescription>CTA clicks and page views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="CTA Clicks" />
                  <Line type="monotone" dataKey="pageViews" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} name="Page Views" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top CTA Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Top CTA Buttons</CardTitle>
            <CardDescription>Most clicked call-to-action buttons</CardDescription>
          </CardHeader>
          <CardContent>
            {clicksByLabelData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clicksByLabelData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No click data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Clicks by Page (Pie) */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Page</CardTitle>
            <CardDescription>Distribution of CTA clicks across pages</CardDescription>
          </CardHeader>
          <CardContent>
            {clicksByPageData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clicksByPageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {clicksByPageData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No click data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scroll Depth by Page */}
      <Card>
        <CardHeader>
          <CardTitle>Scroll Depth & Engagement by Page</CardTitle>
          <CardDescription>Average scroll depth (%) and time on page (seconds)</CardDescription>
        </CardHeader>
        <CardContent>
          {scrollByPageData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scrollByPageData} margin={{ bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" interval={0} />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="avgScroll" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Avg Scroll %" />
                  <Bar dataKey="avgTime" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Avg Time (s)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">No scroll data yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Clicks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent CTA Clicks</CardTitle>
          <CardDescription>Latest 20 click events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">Button</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Page</th>
                  <th className="text-left py-2 font-medium">Destination</th>
                  <th className="text-left py-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {clicks.slice(0, 20).map(c => (
                  <tr key={c.id} className="border-b border-border/50">
                    <td className="py-2 font-medium">{c.button_label}</td>
                    <td className="py-2 text-muted-foreground">{c.button_type}</td>
                    <td className="py-2 text-muted-foreground">{c.page_location}</td>
                    <td className="py-2 text-muted-foreground">{c.destination_url}</td>
                    <td className="py-2 text-muted-foreground whitespace-nowrap">
                      {new Date(c.clicked_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {clicks.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No clicks recorded yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;