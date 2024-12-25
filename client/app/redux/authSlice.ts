import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { email: string; username: string } | null;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; username: string }>) => {
      state.user = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;  
      state.error = null; 
      state.loading = false; 
    },
  },
});

export const { setUser, setError, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
