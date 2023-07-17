import { combineReducers, createStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

function accesstoken(state = { name: "" }, action){
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        name: action.data,
      };
    default:
      return state;
  }
};


const store = createStore(combineReducers({accesstoken}));

export { store }