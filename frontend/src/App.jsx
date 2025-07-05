import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css'

import {Box, MantineProvider} from "@mantine/core";
import {Router} from "@/Router.jsx";
import Helmet from "@/components/Helmet.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Notifications} from "@mantine/notifications";
import theme from "@/styles/theme.jsx";


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
            {/* Main Layout */}
            <Helmet>
                <Router/>
            </Helmet>
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
