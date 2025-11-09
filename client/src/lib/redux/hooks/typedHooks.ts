import type { AppDispatch, AppStore, RootState } from "@/lib/redux/store";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector, useStore } from "react-redux";


export const useAppDispatch: () => AppDispatch = useDispatch;
export const userAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;