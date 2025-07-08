import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import {lazy, Suspense} from "react";
import MainHomePage from "@/pages/MainHomePage.jsx";
import NavBarSettings from "@/components/settings/NavBarSettings.jsx";

const BlogPage = lazy(() => import('@/pages/BlogPage.jsx'));
// const SettingAccountPage = lazy(() => import("@/components/page/SettingAccount.jsx"))
// const SettingBlogPage = lazy( () => import('@/components/page/SettingBlog.jsx'))


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense ><BlogPage/></Suspense>
        ),
        children: [
            { index: true, element: <Navigate to="/home"/> },
            { path: '/home', element: <MainHomePage/> },
            // { path: '/posts/:category', element: <PostPage/> },
            // { path: '/setting/admin', element: <NavbarMenuSettingsPage/> }
            // { path: '/setting/account', element: <Suspense><SettingAccountPage/></Suspense> },
            { path: '/setting/blog', element: <Suspense><NavBarSettings/></Suspense> },
            // { path: '/post/:id', element: <Suspense><PostPage/></Suspense> },
            // { path: '/post/detail/:type/:id', element: <Suspense><PostDetail/></Suspense> },
        ]
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}