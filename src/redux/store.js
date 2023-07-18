import { combineReducers, createStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

function accesstoken(state = { token: "" }, action){
  switch (action.type) {
    case "ADD":
      return {
        token: action.data,
      };
    default:
      return state;
  }
};


const store = createStore(combineReducers({accesstoken}));

export { store }