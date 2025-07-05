import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css'

import {Box, MantineProvider} from "@mantine/core";
import {Router} from "@/Router.jsx";
import Helmet from "@/components/Helmet.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Notifications} from "@mantine/notifications";
import theme from "@/styles/theme.jsx";
import {ToastProvider} from "@/components/Toast.jsx";
import {AuthProvider} from "@/context/AuthContext.jsx";
import {BlogProvider} from "@/context/BlogContext.jsx";

/*
function App() {
    return (
        <MantineProvider defaultColorScheme="auto">
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <AuthProvider>
                        <BlogProvider>
                            <Router>
                                <Routes>
                                    <Route path="/" element={<TechBlogLayout />} />
                                    <Route path="/posts/:id" element={<BlogPost />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            </Router>
                        </BlogProvider>
                    </AuthProvider>
                </ToastProvider>
            </QueryClientProvider>
        </MantineProvider>
    );
}
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        },
    },
});
const AppContent = () => {
    return (
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            <ToastProvider>
                <AuthProvider>
                    <BlogProvider>
                        {/* Main Layout */}
                        <Helmet>
                            <Router/>
                        </Helmet>
                    </BlogProvider>
                </AuthProvider>

            </ToastProvider>

        </MantineProvider>
    );
};
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent/>
        </QueryClientProvider>
    )
}

export default App
