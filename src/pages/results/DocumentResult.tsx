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
        <main className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 pt-[70px] xs:pt-[80px] sm:pt-[90px] md:pt-[100px] lg:pt-[110px] pb-4 xs:pb-6 sm:pb-8">
          <DocumentLayout />
        </main>
      </div>
    </div>
  );
};

export default DocumentResult; 