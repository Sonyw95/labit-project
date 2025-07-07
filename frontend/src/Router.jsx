import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import {lazy, Suspense} from "react";
import HomePage from "@/pages/HomePage.jsx";
import PostPage from "@/pages/PostPage.jsx";

const MainPage = lazy(() => import('@/pages/MainPage.jsx'));
// const SettingAccountPage = lazy(() => import("@/components/page/SettingAccount.jsx"))
// const SettingBlogPage = lazy( () => import('@/components/page/SettingBlog.jsx'))


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense fallback={<div>Loading...</div>} ><MainPage/></Suspense>
        ),
        children: [
            { index: true, element: <Navigate to="/home"/> },
            { path: '/home', element: <HomePage/> },
            { path: '/posts/:category', element: <PostPage/> },

            // { path: '/setting/account', element: <Suspense><SettingAccountPage/></Suspense> },
            // { path: '/setting/blog', element: <Suspense><SettingBlogPage/></Suspense> },
            // { path: '/post/:id', element: <Suspense><PostPage/></Suspense> },
            // { path: '/post/detail/:type/:id', element: <Suspense><PostDetail/></Suspense> },
        ]
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}