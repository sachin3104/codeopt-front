import React from 'react';
import Header from '@/components/header/Header';
import OptimiseLayout from '@/components/optimise-result/OptimiseLayout';
import { Background } from '@/components/background/background';

const OptimiseResult: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <OptimiseLayout />
        </main>
      </div>
    </div>
  );
};

export default OptimiseResult; 