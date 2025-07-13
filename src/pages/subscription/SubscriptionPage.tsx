import React from 'react';
import SubscriptionLayout from '@/components/subscription/SubscriptionLayout';
import { Background } from '@/components/common/background';
import Header from '@/components/common/header/Header';

const SubscriptionPage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <Background />
      
      <div className="relative flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-16 sm:pt-20">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <SubscriptionLayout />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubscriptionPage; 