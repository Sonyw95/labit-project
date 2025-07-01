import '@mantine/core/styles.css';
import {Box, MantineProvider} from "@mantine/core";
import {Router} from "@/Router.jsx";
import Helmet from "@/components/Helmet.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import theme from "@/components/theme/index.jsx";
import {Notifications} from "@mantine/notifications";
import {ToastContainer} from "@/components/toast/ToasContainer.jsx";
import {ToastProvider, useToast} from "@/context/toastContext.jsx";
import {BackToTop} from "@/components/backToTop/index.jsx";


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
    const { toasts, removeToast } = useToast();
    // const { settings } = useThemeSettings();

    // const theme = createTheme({
    //     primaryColor: 'blue',
    //     fontFamily: settings.fontFamily,
    //     defaultRadius: settings.borderRadius,
    //     components: {
    //         Button: {
    //             defaultProps: {
    //                 radius: settings.borderRadius,
    //             },
    //         },
    //         Card: {
    //             defaultProps: {
    //                 radius: settings.borderRadius,
    //             },
    //         },
    //         TextInput: {
    //             defaultProps: {
    //                 radius: settings.borderRadius,
    //             },
    //         },
    //     },
    // });

    return (
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />

            {/* Global Styles */}
            {/*<style>*/}
            {/*    {`*/}
            {/*        ${animationStyles}*/}
            {/*        */}
            {/*        * {*/}
            {/*            box-sizing: border-box;*/}
            {/*        }*/}
            {/*        */}
            {/*        // body {*/}
            {/*        //     margin: 0;*/}
            {/*        //     padding: 0;*/}
            {/*        //     font-family: ${settings.fontFamily};*/}
            {/*        //     -webkit-font-smoothing: antialiased;*/}
            {/*        //     -moz-osx-font-smoothing: grayscale;*/}
            {/*        //     scroll-behavior: ${settings.animations ? 'smooth' : 'auto'};*/}
            {/*        // }*/}
            {/*        //*/}
            {/*        // ${!settings.animations ? `*/}
            {/*        //     *, *::before, *::after {*/}
            {/*        //         animation-duration: 0.01ms !important;*/}
            {/*        //         animation-iteration-count: 1 !important;*/}
            {/*        //         transition-duration: 0.01ms !important;*/}
            {/*        //         scroll-behavior: auto !important;*/}
            {/*        //     }*/}
            {/*        // ` : ''}*/}
            {/*        //*/}
            {/*        // .sr-only {*/}
            {/*        //     position: absolute;*/}
            {/*        //     width: 1px;*/}
            {/*        //     height: 1px;*/}
            {/*        //     padding: 0;*/}
            {/*        //     margin: -1px;*/}
            {/*        //     overflow: hidden;*/}
            {/*        //     clip: rect(0, 0, 0, 0);*/}
            {/*        //     white-space: nowrap;*/}
            {/*        //     border: 0;*/}
            {/*        // }*/}
            {/*    `}*/}
            {/*</style>*/}

            {/* Main Layout */}
            <Helmet>
                <Router/>
            </Helmet>
            {/* 개발 환경에서만 React Query Devtools 표시 */}
            {/*{import.meta.env.DEV && (*/}
            {/*    <Box top={0}>*/}
            {/*        <ReactQueryDevtools*/}
            {/*            initialIsOpen={false}*/}
            {/*            position="bottom-right"*/}
            {/*        />*/}
            {/*    </Box>*/}

            {/*)}*/}
            {/* Global Components */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <BackToTop />
        </MantineProvider>
    );
};
function App() {
    return (
        <ToastProvider>
            <MantineProvider theme={theme} defaultColorScheme="auto" >
                <Notifications position="top-right" />
                <QueryClientProvider client={queryClient}>
                    <AppContent/>
                </QueryClientProvider>
            </MantineProvider>
        </ToastProvider>

    )
}

export default App
