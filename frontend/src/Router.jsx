import React, {lazy, memo, Suspense} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import KakaoCallbackPage from "./pages/KakaoCallbackPage.jsx";
import PostViewPage from "./pages/PostViewPage.jsx";
import PostEditPage from "./pages/PostEdit.jsx";
import AdminManagementPage from "./pages/AdminManagementPage.jsx";
import PostListPage from "@/pages/PostListPage.jsx";
import DashboardPage from "@/pages/DashboardPage.jsx";
import UserProfilePage from "@/pages/UserEditPage.jsx";
import HomePage from "./pages/HomePage.jsx";

const MainLayout = lazy(() => import('@/components/layout/MainLayout.jsx'));
const AppRouter = memo((() => {
    const router = createBrowserRouter([
        { path: '/test', element:<DashboardPage/>},
        { path: '/auth/kakao/callback', element: <KakaoCallbackPage/> },
        {
            path: '/',
            element: (
                <MainLayout/>
            ),
            children: [
                { index: true, element: <Navigate to="/home"/> },
                { path: '/home', element: <HomePage/> },


                { path: '/posts/:category', element: <PostListPage/> },
                { path: '/post/edit/:postId', element: <PostEditPage/> },
                { path: '/post/view/:postId', element: <PostViewPage/> },
                { path: '/posts/:page', element: <></> },

                {path:'/user/settings', element: <UserProfilePage/>},

                // { path: '/setting/user', element: <UserSettings/>},
                { path: '/admin', element: <ProtectedRoute requiredRole="ADMIN"><AdminManagementPage/></ProtectedRoute>}
            ]
        },
    ]);
    return (
        <RouterProvider router={router} />
    );
}))

export default AppRouter;