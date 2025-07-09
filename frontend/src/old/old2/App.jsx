
import '@mantine/core/styles.css';
// import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import './App.css'

import {MantineProvider} from "@mantine/core";
import {Router} from "@/Router.jsx";
import Helmet from "@/components/Helmet.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import theme from "@/styles/theme.jsx";
import {ToastProvider} from "@/components/common/Toast.jsx";
import {AuthProvider} from "@/context/AuthContext.jsx";
import {BlogProvider} from "@/context/BlogContext.jsx";

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
            <ToastProvider>
                <AuthProvider>
                    <BlogProvider>
                        <Helmet>
                            <Router/>
                        </Helmet>
                    </BlogProvider>
                </AuthProvider>
            </ToastProvider>
            {/*<Notifications*/}
            {/*    position="top-right"*/}
            {/*    zIndex={9999}*/}
            {/*    limit={5}*/}
            {/*/>*/}
            {/* Main Layout */}

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
