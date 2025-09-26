import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../../util/supabase';

export function useScrapEstimations(userId) {
    return useQuery({
        queryKey: ['scrapEstimations', userId],
        queryFn: () => dataService.getScrapEstimations(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

export function useAddScrapEstimation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ estimationData, userId }) =>
            dataService.saveScrapEstimation(estimationData, userId),
        onSuccess: (data, variables) => {
            // Invalidate and refetch scrap estimations
            queryClient.invalidateQueries(['scrapEstimations', variables.userId]);
        },
        onError: (error) => {
            console.error('Failed to save estimation:', error);
        },
    });
}
