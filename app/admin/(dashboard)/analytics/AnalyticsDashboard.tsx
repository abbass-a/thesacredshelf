'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

type Visit = {
  id: string;
  session_id: string;
  page_url: string;
  country: string | null;
  country_code: string | null;
  timestamp: string;
};

type Demographics = {
  mock?: boolean;
  gender: Record<string, number>;
  age: Record<string, number>;
};

export default function AnalyticsDashboard({ 
  visits, 
  demographics 
}: { 
  visits: Visit[], 
  demographics: Demographics | null 
}) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('day');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setLastUpdated(new Date().toLocaleTimeString());
    setTimeout(() => setIsRefreshing(false), 500); // Visual feedback
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  // KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const uniqueSessions = new Set(visits.map(v => v.session_id));
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const uniqueToday = new Set(visits.filter(v => new Date(v.timestamp) >= today).map(v => v.session_id));
    
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const uniqueThisWeek = new Set(visits.filter(v => new Date(v.timestamp) >= lastWeek).map(v => v.session_id));
    
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const uniqueThisMonth = new Set(visits.filter(v => new Date(v.timestamp) >= thisMonth).map(v => v.session_id));

    return [
      { label: 'Total Visitors', value: uniqueSessions.size },
      { label: 'Visitors Today', value: uniqueToday.size },
      { label: 'Visitors This Week', value: uniqueThisWeek.size },
      { label: 'Visitors This Month', value: uniqueThisMonth.size },
    ];
  }, [visits]);

  // Chart 1: Visitors Over Time
  const timeData = useMemo(() => {
    const map = new Map<string, Set<string>>();
    
    visits.forEach(v => {
      const date = new Date(v.timestamp);
      let key = '';
      if (timeFilter === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (timeFilter === 'week') {
        // Group by ISO week (approximate: start of week is Monday)
        const day = date.getDay() || 7;
        date.setHours(-24 * (day - 1));
        key = date.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(v.session_id);
    });

    const sortedData = Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, sessions]) => ({
        date,
        visitors: sessions.size,
      }));
    
    // Slice based on filter
    if (timeFilter === 'day') return sortedData.slice(-30);
    if (timeFilter === 'week') return sortedData.slice(-12);
    return sortedData.slice(-12);
  }, [visits, timeFilter]);

  // Chart 2 & 3: Country Data
  const countryData = useMemo(() => {
    const map = new Map<string, { count: Set<string>, code: string }>();
    visits.forEach(v => {
      const c = v.country || 'Unknown';
      const code = v.country_code || 'UN';
      if (!map.has(c)) map.set(c, { count: new Set(), code });
      map.get(c)!.count.add(v.session_id);
    });

    const sorted = Array.from(map.entries())
      .map(([name, { count, code }]) => ({ name, visitors: count.size, code }))
      .sort((a, b) => b.visitors - a.visitors);
      
    const total = sorted.reduce((sum, item) => sum + item.visitors, 0);
    return sorted.map(item => ({ ...item, percentage: total > 0 ? (item.visitors / total) * 100 : 0 }));
  }, [visits]);

  // Chart 4 & 5: Demographics
  const genderData = demographics ? [
    { name: 'Male', value: demographics.gender.male },
    { name: 'Female', value: demographics.gender.female },
    { name: 'Unknown', value: demographics.gender.unknown },
  ] : [];

  const ageData = demographics ? Object.entries(demographics.age).map(([bracket, users]) => ({
    bracket, users
  })) : [];

  // Chart 6: Top Pages
  const topPagesData = useMemo(() => {
    const map = new Map<string, { views: number, sessions: Set<string> }>();
    visits.forEach(v => {
      const url = v.page_url;
      if (!map.has(url)) map.set(url, { views: 0, sessions: new Set() });
      const stats = map.get(url)!;
      stats.views += 1;
      stats.sessions.add(v.session_id);
    });

    return Array.from(map.entries())
      .map(([url, stats]) => ({ url, views: stats.views, unique: stats.sessions.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20);
  }, [visits]);

  const COLORS = ['#A67C2E', '#E8E4DC', '#1C1C1E'];

  return (
    <div className="p-8 pb-20">
        
        {/* Top bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
            <p className="text-sm text-gray-500">Last updated: {lastUpdated || 'Loading...'}</p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 hover:text-[#A67C2E] hover:border-[#A67C2E] transition-all flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{kpi.label}</h3>
              <div className="text-3xl font-bold text-gray-900">{kpi.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Chart 1: Over Time */}
        <div id="visitors" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 scroll-mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Visitors Over Time</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg text-sm">
              <button onClick={() => setTimeFilter('day')} className={`px-3 py-1 rounded-md ${timeFilter === 'day' ? 'bg-white shadow-sm text-[#A67C2E]' : 'text-gray-500'}`}>Day</button>
              <button onClick={() => setTimeFilter('week')} className={`px-3 py-1 rounded-md ${timeFilter === 'week' ? 'bg-white shadow-sm text-[#A67C2E]' : 'text-gray-500'}`}>Week</button>
              <button onClick={() => setTimeFilter('month')} className={`px-3 py-1 rounded-md ${timeFilter === 'month' ? 'bg-white shadow-sm text-[#A67C2E]' : 'text-gray-500'}`}>Month</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="visitors" stroke="#A67C2E" strokeWidth={3} dot={{ r: 4, fill: '#A67C2E' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Chart 2: Country Chart */}
          <div id="countries" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Top Countries</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} width={80} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} cursor={{ fill: '#F3F4F6' }} />
                  <Bar dataKey="visitors" fill="#A67C2E" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Country Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Country Breakdown</h2>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium text-right">Visitors</th>
                    <th className="px-4 py-3 font-medium text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {countryData.slice(0, 10).map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                        <span>{c.name}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">{c.visitors.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{c.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Demographics Row */}
        <div id="demographics" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Chart 4: Gender */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Gender Breakdown</h2>
              {demographics?.mock && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-medium">Sample Data</span>}
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {genderData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

          {/* Chart 5: Age Range */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Age Distribution</h2>
              {demographics?.mock && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-medium">Sample Data</span>}
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="bracket" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} cursor={{ fill: '#F3F4F6' }} />
                  <Bar dataKey="users" fill="#1C1C1E" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 6: Top Pages */}
        <div id="top-pages" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Pages</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Page URL</th>
                  <th className="px-4 py-3 font-medium text-right">Page Views</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Unique Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPagesData.map((page, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-md truncate" title={page.url}>
                      {page.url}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{page.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{page.unique.toLocaleString()}</td>
                  </tr>
                ))}
                {topPagesData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500 italic">No page visits recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

    </div>
  );
}
