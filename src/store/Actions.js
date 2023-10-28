import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedApp: '',
  selectedAppData: '',
  selectedAppID: '',
  navigationItems: [],
  anchorElUser: null,
  mobileOpen: false,
  activeContent: 'Tasks',
  whatsappNumber:'254775478701',
  phoneNumberId:'118868224638325',
  selectedEntityId:'',
  // mUrl:"https://crm.lmglobalexhibitions.com/api.php",
  mUrl:"http://localhost/crm/api.php",
  DB: 'your-default-database-path',
  DB1: 'crm', // Replace with your actual default database path
};

const Actions = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedEntityId: (state, action) => {
      state.selectedEntityId = action.payload;
    },
    setSelectedApp: (state, action) => {
      state.selectedApp = action.payload;
    },
    setSelectedAppData: (state, action) => {
      state.selectedAppData = action.payload;
    },
    setMurl: (state, action) => {
      state.mUrl = action.payload;
    },
    setSelectedAppID: (state, action) => {
      state.selectedAppID = action.payload;
    },
    setNavigationItems: (state, action) => {
      state.navigationItems = action.payload;
    },
    setAnchorElUser: (state, action) => {
      state.anchorElUser = action.payload;
    },
    setMobileOpen: (state, action) => {
      state.mobileOpen = action.payload;
    },
    setActiveContent: (state, action) => {
      state.activeContent = action.payload;
    },
    updateDB: (state, action) => {
      state.DB = action.payload;
    },
  },
});

export const {
  setSelectedApp,
  setSelectedAppID,
  setNavigationItems,
  setAnchorElUser,
  setMobileOpen,
  setActiveContent,
  updateDB, 
  mUrl,
  selectedEntityId,
  selectedAppData,
  setSelectedAppData
} = Actions.actions;

export const getDB = (state) => {
  return state.app.DB;
};
export const updateDBPath = (newDBPath) => async (dispatch) => {
  await dispatch(updateDB(newDBPath)); // Update DB path in the Redux store
  return newDBPath; // Return the new DB path
}; 

export default Actions.reducer;
