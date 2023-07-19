import { combineReducers, createStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const accesstoken = (state = { token: "" }, action) => {
  switch (action.type) {
    case "ADD_TOKEN":
      return {
        token: action.data,
      };
    case 'REMOVE_TOKEN':
      return {}
    default:
      return state;
  }
};

const user = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...action.data,
      };
    case 'REMOVE_USER':
      return {}
    default:
      return state;
  }

};


const store = configureStore({
  reducer: {
    accesstoken,
    user,
  },
});

export { store }