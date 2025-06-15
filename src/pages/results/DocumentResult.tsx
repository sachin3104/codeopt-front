import React from 'react';
import Header from '@/components/header/Header';
import DocumentLayout from '@/components/document-result/DocumentLayout';
import { Background } from '@/components/background/background';

const DocumentResult = () => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <DocumentLayout />
        </main>
      </div>
    </div>
  );
};

export default DocumentResult; 