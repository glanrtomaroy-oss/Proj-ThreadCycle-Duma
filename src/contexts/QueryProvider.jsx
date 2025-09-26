import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            retry: (failureCount, error) => {
                if (error.status === 404) return false;
                return failureCount < 3;
            },
        },
        mutations: {
            retry: 1,
        },
    },
});

export function QueryProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
