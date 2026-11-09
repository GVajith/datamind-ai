export const GENERALPATH = {
  HOME: { ID: 1, PATH: "/", PARENT: null },
  SIGNIN: { ID: 2, PATH: "/sign-in", PARENT: "HOME" },
  SIGNUP: { ID: 3, PATH: "/sign-up", PARENT: "HOME" },
  FORGOT_PASSWORD: { ID: 4, PATH: "/forgot-password", PARENT: "HOME" },
  DASHBOARD: { ID: 5, PATH: "/dashboard", PARENT: "AUTHENTICATED" },
};
