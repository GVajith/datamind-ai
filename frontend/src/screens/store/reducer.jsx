import * as actionTypes from "./actionTypes";
import { clearAuth, loadAuth, saveAuth } from "./sessionStorage";

const initialState = {
  auth: loadAuth(),
  isLoggedIn: Boolean(loadAuth()?.access_token),
  isLoading: false,
};

export default function dataMindReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      saveAuth(action.data);
      return { ...state, auth: action.data, isLoggedIn: true };
    case actionTypes.AUTH_CLEAR:
      clearAuth();
      return { ...state, auth: null, isLoggedIn: false };
    case actionTypes.REQUEST_START:
      return { ...state, isLoading: true };
    case actionTypes.REQUEST_END:
      return { ...state, isLoading: false };
    default:
      return state;
  }
}
