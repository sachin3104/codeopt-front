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
        
        <main className="flex-grow pt-16">
          <div className="max-w-8xl mx-auto px-4 py-8">
            <SubscriptionLayout />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubscriptionPage; 