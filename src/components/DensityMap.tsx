import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell, CartesianGrid } from 'recharts';

interface DensityMapProps {
  data: { village: string; count: number }[];
}

export const DensityMap: React.FC<DensityMapProps> = ({ data }) => {
  // Sort data descending and take top 12 for readability
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 12);

  return (
    <div className="w-full h-full relative min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={sortedData} 
          layout="vertical" 
          margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis 
            dataKey="village" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} 
            width={120} 
          />
          <RechartsTooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontSize: '13px', fontWeight: 500 }}
            formatter={(value: number) => [`${value} farmers`, 'Coverage']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index < 3 ? '#0f766e' : index < 7 ? '#14b8a6' : '#5eead4'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};



