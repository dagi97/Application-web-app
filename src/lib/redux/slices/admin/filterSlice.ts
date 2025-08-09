import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    searchText: string,
    role: string,
    currentPage: number
}

const initialState: FilterState = {
    searchText: '',
    role: 'All Roles',
    currentPage: 1
}

const filterSlice = createSlice({
    name: 'filter',
    initialState: initialState,
    reducers : {
        setSearchText: (state, action: PayloadAction<string>) => {
            state.searchText = action.payload
            state.currentPage = 1
        },

        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload.toLowerCase()
            state.currentPage = 1
        },

        setCurrentPage : (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        }

    }
})

export const { setSearchText, setRole , setCurrentPage} = filterSlice.actions;

export default filterSlice.reducer;