import { createSlice } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface ThemeState {
    mode: Theme;
}

const initialState: ThemeState = {
    mode: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;