import React from 'react';
import Header from '../common/header/Header';
import ActionButtons from './ActionButtons';
import CodeEditor from '../common/editor/CodeEditor';
import { Background } from '@/components/common/background';
import SubscriptionWidget from '../subscription/SubscriptionWidget';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Background />
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Action Buttons Section */}
        <div className="mb-8">
          <ActionButtons />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Code Editor Section */}
          <div className="lg:col-span-4 h-[600px]">
            <CodeEditor height="100%" />
          </div>

          {/* Subscription Widget Section */}
          {/* <div className="lg:col-span-1">
            <SubscriptionWidget variant="detailed" />
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Layout; 