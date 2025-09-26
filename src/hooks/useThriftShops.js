import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../util/supabase';

export function useThriftShops() {
    return useQuery({
        queryKey: ['thriftShops'],
        queryFn: dataService.getThriftShops,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}
