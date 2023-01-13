
// import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../sass/app.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // fetch に失敗した時に自動的にリトライするか
            refetchOnWindowFocus: false, // フォーカス時に再検証するか
            // suspense: true, // susupense と組み合わせる
            // cacheTime: 10
            refetchOnMount: false,
            refetchOnReconnect: false,
            staleTime: 1000 * 60 * 60 * 24
        }
    }
});


root.render(
    // <React.StrictMode>
        <div className="">
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </div>
    // </React.StrictMode>,
);