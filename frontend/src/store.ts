import {combineReducers, configureStore} from "@reduxjs/toolkit";

export interface IStore {
}

const store = configureStore({
  reducer: combineReducers([]),
});

export default store;
