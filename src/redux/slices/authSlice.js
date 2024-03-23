import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    id: '',
    email: '',
    role_id: '',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.value.id = action.payload.id;
      state.value.email = action.payload.email;
      state.value.role_id = action.payload.role_id;
    },
    logOut: (state) => {
      state.value = initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
