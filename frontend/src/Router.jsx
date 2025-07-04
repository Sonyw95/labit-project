import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import {lazy, Suspense} from "react";

const MainPage = lazy(() => import('@/components/layout/MainPage.jsx'));
const HomePage = lazy(() => import("@/components/layout/HomePage.jsx"))
const PostPage = lazy(() => import('@/components/layout/PostPage.jsx'))
// const SettingAccountPage = lazy(() => import("@/components/page/SettingAccount.jsx"))
// const SettingBlogPage = lazy( () => import('@/components/page/SettingBlog.jsx'))


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense><MainPage/></Suspense>
        ),
        children: [
            { index: true, element: <Navigate to="/home"/> },
            { path: '/home', element: <Suspense><HomePage/></Suspense> },
            { path: '/posts/:category', element:<Suspense><PostPage/></Suspense> }
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