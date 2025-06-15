import React from 'react';
import Header from '@/components/header/Header';
import AnalyseLayout from '@/components/analyse-result/AnalyseLayout';
import { Background } from '@/components/background/background';

const AnalyseResult: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <AnalyseLayout />
        </main>
      </div>
    </div>
  );
};

export default AnalyseResult; 