import * as actionTypes from "./actionTypes";

export const authenticate = (data) => ({ type: actionTypes.AUTH_SUCCESS, data });
export const clearAuthentication = () => ({ type: actionTypes.AUTH_CLEAR });
export const startRequest = () => ({ type: actionTypes.REQUEST_START });
export const endRequest = () => ({ type: actionTypes.REQUEST_END });
