import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../../../common/ProtectedRoute/ProtectedRoute";
import ForgotPassword from "../../../components/Authentication/ForgotPassword";
import SignIn from "../../../components/Authentication/SignIn";
import SignUp from "../../../components/Authentication/SignUp";
import Dashboard from "../../../components/Dashboard/Dashboard";
import LandingPage from "../../../components/LandingPage/LandingPage";
import { GENERALPATH } from "./GeneralRoutesConfig";

export default function GeneralRoutes() {
  return <Routes><Route path={GENERALPATH.HOME.PATH} element={<LandingPage/>}/><Route path={GENERALPATH.SIGNIN.PATH} element={<SignIn/>}/><Route path={GENERALPATH.SIGNUP.PATH} element={<SignUp/>}/><Route path={GENERALPATH.FORGOT_PASSWORD.PATH} element={<ForgotPassword/>}/><Route path={GENERALPATH.DASHBOARD.PATH} element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>;
}
