import React, {lazy, Suspense} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import AdminPage from "./pages/AdminPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import KakaoCallbackPage from "./pages/KakaoCallbackPage.jsx";
import UserSettings from "@/components/common/Auth/UserSettings.jsx";
import HomePage from "@/stores/HomePage.jsx";
import PostEdit from "./pages/PostEdit.jsx";
import PostViewPage from "./pages/PostViewPage.jsx";

const MainLayout = lazy(() => import('@/components/layout/MainLayout.jsx'));
const AppRouter = () => {
    const router = createBrowserRouter([
        { path: '/auth/kakao/callback', element: <KakaoCallbackPage/> },
        {
            path: '/',
            element: (
                <Suspense ><MainLayout/></Suspense>
            ),
            children: [
                { index: true, element: <Navigate to="/home"/> },
                { path: '/home', element: <HomePage/> },


                { path: '/post/edit', element: <PostEdit/> },
                { path: '/post/view/:postId', element: <PostViewPage/> },
                { path: '/posts/:page', element: <></> },


                // { path: '/setting/user', element: <UserSettings/>},
                { path: '/admin', element: <ProtectedRoute requiredRole="ADMIN"><AdminPage/></ProtectedRoute>}
            ]
        },
    ]);
    return (
        <RouterProvider router={router} />
    );
}

AppRouter.displayName = 'AppRouter';
export default AppRouter;