import '@mantine/core/styles.css';
import {Alert, MantineProvider} from "@mantine/core";
import theme from "@/components/theme/Theme.jsx";
import {Router} from "@/Router.jsx";
import Helmet from "@/components/Helmet.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        },
    },
});
function App() {
    return (
        <MantineProvider theme={theme} defaultC
                         olorScheme="auto" withGlobalStyles withNormalizeCSS>
            <QueryClientProvider client={queryClient}>
                <Helmet>
                    <Router/>
                </Helmet>
            </QueryClientProvider>

        </MantineProvider>
    )
}

export default App
