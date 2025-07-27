import React, {lazy, Suspense} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import KakaoCallbackPage from "./pages/KakaoCallbackPage.jsx";
import PostViewPage from "./pages/PostViewPage.jsx";
import MainPage from "@/pages/HomePage.jsx";
import PostEditPage from "./pages/PostEdit.jsx";
import AdminManagementPage from "./pages/AdminManagementPage.jsx";
import PostListPage from "@/pages/PostListPage.jsx";
import DashboardPage from "@/pages/DashboardPage.jsx";
import UserProfilePage from "@/pages/UserEditPage.jsx";

const MainLayout = lazy(() => import('@/components/layout/MainLayout.jsx'));
const AppRouter = () => {
    const router = createBrowserRouter([
        { path: '/test', element:<DashboardPage/>},
        { path: '/auth/kakao/callback', element: <KakaoCallbackPage/> },
        {
            path: '/',
            element: (
                <Suspense ><MainLayout/></Suspense>
            ),
            children: [
                { index: true, element: <Navigate to="/home"/> },
                { path: '/home', element: <MainPage/> },


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
}

AppRouter.displayName = 'AppRouter';
export default AppRouter;