const AUTH_KEY = "datamind.auth";

export const loadAuth = () => {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY) || "null");
  } catch {
    sessionStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const saveAuth = (auth) => sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
export const clearAuth = () => sessionStorage.removeItem(AUTH_KEY);
