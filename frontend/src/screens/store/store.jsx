import { combineReducers, createStore } from "redux";

import dataMindReducer from "./reducer";

export const store = createStore(combineReducers({ dataMindReducer }));
