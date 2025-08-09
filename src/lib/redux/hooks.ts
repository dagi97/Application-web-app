// src/lib/redux/hooks.ts
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Create typed versions of the hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;