import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import {lazy, Suspense} from "react";

const MainLayout = lazy(() => import('@/pages/MainLayout.jsx'));
// const SettingAccountPage = lazy(() => import("@/components/page/SettingAccount.jsx"))


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense ><MainLayout/></Suspense>
        ),
        children: [
            // { index: true, element: <Navigate to="/home"/> },
            // { path: '/home', element: <MainHomePage/> },
            // { path: '/posts/:category', element: <PostPage/> },
            // { path: '/setting/admin', element: <NavbarMenuSettingsPage/> }
            // { path: '/setting/account', element: <Suspense><SettingAccountPage/></Suspense> },
            // { path: '/settings/blog' , element: <BlogSettings/>},
            // { path: '/post/:id', element: <Suspense><PostPage/></Suspense> },
            // { path: '/post/detail/:type/:id', element: <Suspense><PostDetail/></Suspense> },
        ]
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}