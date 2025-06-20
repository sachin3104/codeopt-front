// File: src/App.tsx
// FIXED VERSION - Router context order corrected

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
import { AnalyzeProvider } from './context/AnalyzeContext';
import { OptimizeProvider } from './context/OptimizeContext';
import { DocumentProvider } from './context/DocumentContext';
import { ConvertProvider } from './context/ConvertContext';
import LoadingOverlay from './components/common/LoadingOverlay';
import { LoadingProvider } from './context/LoadingContext';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppProvider>
        <LoadingProvider> 
          <CodeProvider>
            <AnalyzeProvider>
              <OptimizeProvider>
                <ConvertProvider>
                  <DocumentProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <AppRoutes />
                      <LoadingOverlay />
                    </TooltipProvider>
                  </DocumentProvider>
                </ConvertProvider>
              </OptimizeProvider>
            </AnalyzeProvider>
          </CodeProvider>
        </LoadingProvider>
      </AppProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;