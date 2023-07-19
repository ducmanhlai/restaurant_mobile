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
const listOrder = (state = [], action) => {
  switch (action.type) {
    case "INIT_ORDER":
      return [...action.data]
    case "ADD_ORDER":
      return [...state.filter(item=>{
        return item.id.localeCompare(action.data.id) !=0 
      }),action.data];
    case 'REMOVE_ORDER':
      return []
    default:
      return [];
  }
};

const store = configureStore({
  reducer: {
    accesstoken,
    user,
    listOrder
  },
});

export { store }