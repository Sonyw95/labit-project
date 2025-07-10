import React, {lazy, Suspense} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import HomeLayout from "./pages/HomeLayout.jsx";
import OptimizedLoading from "./components/common/OptimizedLoading.jsx";
import NavbarSettings from "./components/layout/NavbarSettings .jsx";
import PostEditLayout from "./pages/PostEditLayout.jsx";
import PostView from "./components/blog/PostView.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PostListLayout from "@/components/layout/PostListLayout.jsx";

const MainLayout = lazy(() => import('@/pages/MainLayout.jsx'));
const AppRouter = () => {
    const router = createBrowserRouter([
        { path: '*', element: <NotFoundPage/> },
        {
            path: '/',
            element: (
                <Suspense fallback={<OptimizedLoading type="page" />} ><MainLayout/></Suspense>
            ),
            children: [
                { index: true, element: <Navigate to="/home"/> },
                { path: '/home', element: <HomeLayout/> },
                { path: '/setting/blog', element: <NavbarSettings />},
                { path: '/posts/:category', element: <PostListLayout/> },
                { path: '/post/edit', element: <PostEditLayout/>},
                { path: '/post/view', element: <PostView/>}
            ]
        },
    ]);
    return (
        <RouterProvider router={router} />
    );
}

AppRouter.displayName = 'AppRouter';
export default AppRouter;