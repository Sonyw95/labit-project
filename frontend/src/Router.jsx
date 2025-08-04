import React, {lazy, memo} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import KakaoCallbackPage from "./pages/KakaoCallbackPage.jsx";
import PostViewPage from "./pages/PostViewPage.jsx";
import PostEditPage from "./pages/PostEdit.jsx";
import AdminManagementPage from "./pages/AdminManagementPage.jsx";
import PostListPage from "@/pages/PostListPage.jsx";
import UserProfilePage from "@/pages/UserEditPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ErrorPage from "@/pages/ErrorPage.jsx";

const MainLayout = lazy(() => import('@/components/layout/MainLayout.jsx'));

const AppRouter = memo((() => {
    const router = createBrowserRouter([
        // { path: '/test', element:<DashboardPage/>},
        {
            path: '/',
            element:  <MainLayout/>,
            errorElement: <ErrorPage />,
            children: [
                { index: true, element: <Navigate to="/home"/> },
                { path: '/home', element: <HomePage/> },


                { path: '/posts/:category', element: <PostListPage/> },
                { path: '/post/edit', element: <PostEditPage/> },
                { path: '/post/edit/:postId', element: <PostEditPage/> },
                { path: '/post/view/:postId', element: <PostViewPage/> },

                {path:'/user/settings', element:<UserProfilePage /> },

                // { path: '/setting/user', element: <UserSettings/>},
                { path: '/admin', element: <AdminManagementPage/>}
            ]
        },
        { path: '/auth/kakao/callback', element: <KakaoCallbackPage/> },
        { path: '/error/:code', element: <ErrorPage/> },
        { path: '*' , element:<ErrorPage/> }
    ]);
    return (
        <RouterProvider router={router} />
    );
}))

/*
  <Route path="/" element={<Home />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/error/:code" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
 */

export default AppRouter;