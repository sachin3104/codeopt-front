import React from 'react';
import Header from '@/components/common/header/Header';
import OptimiseLayout from '@/components/optimize/OptimiseLayout';
import { Background } from '@/components/common/background';

const OptimiseResult: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Header variant="optimize" />
        <main className="container mx-auto px-0 pt-[70px] pb-8">
          <OptimiseLayout />
        </main>
      </div>
    </div>
  );
};

export default OptimiseResult; 