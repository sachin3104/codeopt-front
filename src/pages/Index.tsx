// src/pages/Index.tsx
// Updated to work with refactored CodeOptimizer that uses page-based routing
import React from 'react';
import CodeOptimizer from '@/components/CodeOptimizer';
import Header from '@/components/Header';
// import BeamsBackground from '@/components/beams-backgruond';

const Index: React.FC = () => {
  return (
    <>
      <Header />
      <CodeOptimizer />
    </>
  );
};

export default Index;