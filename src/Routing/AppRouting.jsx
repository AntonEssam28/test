import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MaiNLayout";
import Home from "../Pages/Home/Home"
import Profile from "../Pages/Profile/Profile"
import NotFound from "../Pages/NotFound/NotFound"
import AuthLayout from "../Layouts/AuthLayout/AuthLayout"
import Login from "../Pages/Auth/Login/Login"
import Register from "../Pages/Auth/Register/Register"
import MainProtectedRoute from "../Components/Guard/MainProtectedRoute/MainProtectedRoute";
import AuthProtected from "../Components/Guard/AuthProtected/AuthProtected";
import PostDetails from "../Pages/PostDetails/PostDetails";
import ChangePassword from "../Pages/ChangePassword/ChangePasswod";


export const routes =createBrowserRouter([
    {path:'',element:<MainProtectedRoute><MainLayout /></MainProtectedRoute>,children:[
        {index:true,element:<Home />},
        {path:'profile/:userId',element:<Profile />},
        {path:'postDetails/:postId',element:<PostDetails />},
        {path: 'changePassword',element: <MainProtectedRoute><ChangePassword /></MainProtectedRoute>},
        {path:'*',element:<NotFound />},

    ]},
    {
        path: 'auth', element:<AuthProtected><AuthLayout/></AuthProtected>,children:[
            {path:'login', element:<Login />},
            {path:'signup', element:<Register />}
        ]
    }
])