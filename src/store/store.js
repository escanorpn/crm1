// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import appReducer from './Actions'; // Import the appSlice reducer

const store = configureStore({
  reducer: {
    app: appReducer, // Use the appSlice reducer
  },
});

export default store;
