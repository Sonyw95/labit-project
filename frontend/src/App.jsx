import '@mantine/core/styles.css';
import {MantineProvider} from "@mantine/core";
import theme from "@/components/theme/Theme.jsx";
import {Router} from "@/Router.jsx";
import Helmet from "@/components/Helmet.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";


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
                {/* 개발 환경에서만 React Query Devtools 표시 */}
                {import.meta.env.DEV && (
                    <ReactQueryDevtools
                        initialIsOpen={false}
                        position="bottom-right"
                    />
                )}
            </QueryClientProvider>

        </MantineProvider>
    )
}

export default App
