import React from 'react';
import Header from '../header/Header';
import ActionButtons from './ActionButtons';
import CodeEditor from '../editor/CodeEditor';
import { Background } from '@/components/background/background';

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

        {/* Code Editor Section */}
        <div className="w-full h-[600px]">
          <CodeEditor height="100%" />
        </div>
      </main>
    </div>
  );
};

export default Layout; 