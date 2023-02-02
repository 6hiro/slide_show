import { useQuery } from '@tanstack/react-query';

import axios from '../libs/axios';



const fetchUser = async () => {
    const { data } = await axios
        .get('/api/v1/user');
    return data.data; 
};

export const useQueryUser = () => {

    return useQuery({
        queryKey: ['user'],
        queryFn: () => fetchUser(),
        staleTime: Infinity,
        // refetchOnMount: false,
    });
};
