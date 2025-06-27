import MainLayout from "../layouts/main/MainLayout";
import {Navigate, useRoutes} from 'react-router-dom';
import BlogPage from "../pages/BlogPage";
import DefaultLayout from "../layouts/DefaultLayout";
import ErrorPage from "../pages/ErrorPage";
import PostDetail from "../sections/main/blog/PostDetail";
import PostEdit from "../sections/main/blog/PostEdit";
import ProfilePage from "../pages/ProfilePage";

export default function Router(){
    return useRoutes([
        {
            path: '/',
            element: <MainLayout/>,
            children: [
                {element: <Navigate to={"/main"}/>, index: true},
                {path: 'main', element: <ProfilePage/>},
                {path: 'blog/*', element: <BlogPage/>},
                {path: 'blog/post*', element: <PostDetail/>},
                {path: 'blog/edit*', element: <PostEdit/>}
            ],
        },
        {
            element: <DefaultLayout/>,
            children: [
                {element: <Navigate to={"/blog"}/>, index: true},
                {path: '404', element: <ErrorPage type={'404'}/>}
            ]
        },
        {
            path: 'login',
            element: <MainLayout/>
        },
        {
            path: '*',
            element: <Navigate to={"/404"} replace/>
        }
    ]);
}
