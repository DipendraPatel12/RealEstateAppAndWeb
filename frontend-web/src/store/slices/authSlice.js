import { createSlice } from '@reduxjs/toolkit';
import { setAccessToken } from '@/lib/axios';

const initialState = {
  user: null,
  isAuthenticated: false,
  selectedRoleTab: 'AGENT',
  registrationEmail: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.accessToken) {
        setAccessToken(action.payload.accessToken);
      }
    },
    setSelectedRoleTab: (state, action) => {
      state.selectedRoleTab = action.payload;
    },
    setRegistrationEmail: (state, action) => {
      state.registrationEmail = action.payload;
    },
    updateAgentProfile: (state, action) => {
      if (state.user) {
        state.user.agentProfile = {
          ...state.user.agentProfile,
          ...action.payload
        };
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.registrationEmail = null;
      setAccessToken(null);
    }
  }
});

export const {
  setCredentials,
  setSelectedRoleTab,
  setRegistrationEmail,
  updateAgentProfile,
  logout
} = authSlice.actions;

export default authSlice.reducer;
