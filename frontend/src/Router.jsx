import React, {lazy, Suspense} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import HomeLayout from "./pages/HomeLayout.jsx";
import OptimizedLoading from "./components/common/OptimizedLoading.jsx";

const MainLayout = lazy(() => import('@/pages/MainLayout.jsx'));
const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <Suspense fallback={<OptimizedLoading type="page" />} ><MainLayout/></Suspense>
            ),
            children: [
                { index: true, element: <Navigate to="/home"/> },
                { path: '/home', element: <HomeLayout/> },
            ]
        },
    ]);
    return (
        <RouterProvider router={router} />
    );
}

AppRouter.displayName = 'AppRouter';
export default AppRouter;