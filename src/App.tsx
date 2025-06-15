// File: src/App.tsx
// Updated to use AppProvider for managed context flow
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Context Providers
import { AppProvider } from '@/context/AppProvider';
import { CodeProvider } from '@/context/CodeContext';

// Routes
import AppRoutes from '@/routes';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <CodeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CodeProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;