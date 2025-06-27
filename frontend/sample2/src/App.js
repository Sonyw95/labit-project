import './App.css';
import {HelmetProvider} from "react-helmet-async";
import {BrowserRouter} from "react-router-dom";
import ThemeProvider from "./theme/themeIndex";
import ScrollToTop from "./components/scroll/to-top/ScrollToTop";
import Router from "./router/routes";

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ThemeProvider>
                    <Router/>
                </ThemeProvider>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
