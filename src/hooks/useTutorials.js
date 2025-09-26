import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../util/supabase';

export function useTutorials() {
    return useQuery({
        queryKey: ['tutorials'],
        queryFn: dataService.getTutorials,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
