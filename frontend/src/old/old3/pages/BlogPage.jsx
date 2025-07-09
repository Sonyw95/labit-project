import AppLayout from "@/components/layout/AppLayout.jsx";
import {Outlet} from "react-router-dom";

const BlogPage = () => {
    const loading = false;
    // const {colorScheme} = useMantineColorScheme(); // 리렌더링 없음
    // const isDark = colorScheme === 'dark';
    // const isDark = useSelectiveColorScheme(state => state.isDark);

    return (
        <AppLayout loading={loading} >
            {/*{loading ? (*/}
            {/*    <CustomLoader progress={progress} />*/}
            {/*) : (*/}
            {/*    <>*/}
            {/*        <Outlet*/}
            {/*            context={loading}*/}
            {/*        />*/}
            {/*        /!*<HeroSection currentTech={currentTech} />*!/*/}
            {/*        /!*<RecentPosts />*!/*/}
            {/*    </>*/}
            {/*)}*/}
            <Outlet
                context={{loading}}
            />
        </AppLayout>
    );
};

export default BlogPage;