import {
    useQuery,
    // useMutation,
    // useQueryClient,
    // QueryClient,
} from '@tanstack/react-query';

import axios from '../libs/axios';


const getUser = async () => {
    const { data } = await axios
        .get('/api/v1/user');

    return data.data; 
};

export const useQueryUser = (
    // {middleware, redirectIfAuthenticated}: {middleware?: string, redirectIfAuthenticated?: any} = {}
) => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
        staleTime: Infinity
    });
};
