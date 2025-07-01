import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import {lazy, Suspense} from "react";


// const MainLayout = lazy(() => import("@/components/layouts/main/MainLayout.jsx"));
const MainLayout = lazy(() => import('@/components/MainLayout.jsx'));
const HomePage = lazy(() => import("@/components/page/Home.jsx"))

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense ><MainLayout/></Suspense>
        ),
        children: [
            { index: true, element: <Navigate to="/home"/> },
            { path: 'home', element: <Suspense><HomePage/></Suspense> },
            // { path: '/post/:id', element: <Suspense><PostPage/></Suspense> },
            // { path: '/post/detail/:type/:id', element: <Suspense><PostDetail/></Suspense> },
        ]
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}