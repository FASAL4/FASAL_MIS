import React, { useState } from 'react';
import { Home, BarChart2, Shield, Leaf, Building2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { OverviewTab } from './DashboardTabs/OverviewTab';
import { AgricultureTab } from './DashboardTabs/AgricultureTab';
import { RightsTab } from './DashboardTabs/RightsTab';
import { NutritionTab } from './DashboardTabs/NutritionTab';
import { InstitutionsTab } from './DashboardTabs/InstitutionsTab';
import { BaselineTab } from './DashboardTabs/BaselineTab';

interface DashboardProps {
  farmersData: any[];
  totalLeverageAmount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ farmersData, totalLeverageAmount }) => {
  const [activeTab, setActiveTab] = useState('baseline');

  return (
    <div className="w-full">
      <div className="mb-6 flex gap-2 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'baseline', label: '0. Baseline Survey', icon: BookOpen },
          { id: 'overview', label: '1. Results Scorecard', icon: Home },
          { id: 'agriculture', label: '2. Agriculture Economy', icon: Leaf },
          { id: 'rights', label: '3. R&E Convergence', icon: Shield },
          { id: 'nutrition', label: '4. Nutrition Security', icon: Leaf },
          { id: 'institutions', label: '5. Institutions and capacity building', icon: Building2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {activeTab === 'overview' && <OverviewTab farmersData={farmersData} totalLeverageAmount={totalLeverageAmount} />}
            {activeTab === 'agriculture' && <AgricultureTab />}
            {activeTab === 'rights' && <RightsTab farmersData={farmersData} />}
            {activeTab === 'nutrition' && <NutritionTab />}
            {activeTab === 'institutions' && <InstitutionsTab />}
            {activeTab === 'baseline' && <BaselineTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};