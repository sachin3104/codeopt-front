import React from 'react';
import Header from '@/components/common/header/Header';
import DocumentLayout from '@/components/document/DocumentLayout';
import { Background } from '@/components/common/background';

const DocumentResult = () => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Header variant="document" />
        <main className="container mx-auto px-4 pt-[70px] pb-8">
          <DocumentLayout />
        </main>
      </div>
    </div>
  );
};

export default DocumentResult; 