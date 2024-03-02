import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    isLoggedIn: false,
    id: '',
    email: '',
    role: 'admin',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.value.isLoggedIn = true;
      state.value.id = action.payload.id;
      state.value.email = action.payload.email;
      state.value.role = action.payload.role;
    },
    logOut: (state) => {
      state.value = initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
