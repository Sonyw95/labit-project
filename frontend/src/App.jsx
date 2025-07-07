
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css'

import {ColorSchemeScript, MantineProvider} from "@mantine/core";
import {Router} from "@/Router.jsx";
import {QueryClient} from "@tanstack/react-query";
import Helmet from "@/components/common/Helmet.jsx";
import {BrowserRouter} from "react-router-dom";

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
        <>
            <ColorSchemeScript defaultColorScheme="auto" />
            <MantineProvider defaultColorScheme="auto">
                <Helmet>
                    <Router/>
                </Helmet>
            </MantineProvider>
        </>
    );
}

export default App
