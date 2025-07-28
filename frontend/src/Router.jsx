import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
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

// 로딩 컴포넌트
const LoadingFallback = () => (
    <Center h="100vh">
        <Loader size="lg" />
    </Center>
);

const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: '/test',
            element: (
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <DashboardPage />
                </ProtectedRoute>
            )
        },
        {
            path: '/auth/kakao/callback',
            element: <KakaoCallbackPage />
        },
        {
            path: '/',
            element: (
                <Suspense fallback={<LoadingFallback />}>
                    <MainLayout />
                </Suspense>
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to="/home" replace />
                },
                {
                    path: 'home',
                    element: <MainPage />
                },
                {
                    path: 'posts/:category',
                    element: <PostListPage />
                },
                {
                    path: 'post/view/:postId',
                    element: <PostViewPage />
                },
                {
                    path: 'post/edit/:postId',
                    element: (
                        <ProtectedRoute fallbackPath="/home">
                            <PostEditPage />
                        </ProtectedRoute>
                    )
                },
                {
                    path: 'user/settings',
                    element: (
                        <ProtectedRoute fallbackPath="/home">
                            <UserProfilePage />
                        </ProtectedRoute>
                    )
                },
                {
                    path: 'admin',
                    element: (
                        <ProtectedRoute
                            allowedRoles={['ADMIN', 'SUPER_ADMIN']}
                            fallbackPath="/home"
                        >
                            <AdminManagementPage />
                        </ProtectedRoute>
                    )
                }
            ]
        },
        {
            path: '*',
            element: <Navigate to="/home" replace />
        }
    ]);

    return <RouterProvider router={router} />;
};

AppRouter.displayName = 'AppRouter';
export default AppRouter;