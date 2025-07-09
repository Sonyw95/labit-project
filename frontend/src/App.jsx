
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css'

import {ColorSchemeScript, MantineProvider} from "@mantine/core";
import {Router} from "@/Router.jsx";
import {QueryClient} from "@tanstack/react-query";
import Helmet from "@/components/common/Helmet.jsx";
import {memo} from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5분
            gcTime: 10 * 60 * 1000,   // 10분
            retry: 3,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});
const AppContent = memo(() => {
    return (
        <>
            <Helmet>
                <Router/>
            </Helmet>
        </>
    );
});
function App() {
    return (
        <>
            <ColorSchemeScript defaultColorScheme="auto" />
            <MantineProvider defaultColorScheme='auto'>
                <AppContent/>
            </MantineProvider>
        </>
    );
}

export default App
