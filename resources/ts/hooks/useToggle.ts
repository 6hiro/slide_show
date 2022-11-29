import { Reducer, useReducer } from 'react';
// https://github.com/streamich/react-use/blob/master/docs/useToggle.md

const toggleReducer = (state: boolean, nextValue?: any) =>
    typeof nextValue === 'boolean' ? nextValue : !state;

const useToggle = (initialValue: boolean): [boolean, (nextValue?: any) => void] => {
    return useReducer<Reducer<boolean, any>>(toggleReducer, initialValue);
};

export default useToggle;