import {useLoadingProgress} from "@/hooks/useLoadingProgress.js";
import AppLayout from "@/components/layout/AppLayout.jsx";
import {Outlet} from "react-router-dom";
import CustomLoader from "@/components/common/CustomLoader.jsx";

const BlogPage = () => {
    const { loading, progress } = useLoadingProgress();
    // const currentTech = useTechStackRotation(loading);

    return (
        <AppLayout loading={loading}>
            {loading ? (
                <CustomLoader progress={progress} />
            ) : (
                <>
                    <Outlet
                        context={loading}
                    />
                    {/*<HeroSection currentTech={currentTech} />*/}
                    {/*<RecentPosts />*/}
                </>
            )}
        </AppLayout>
    );
};

export default BlogPage;