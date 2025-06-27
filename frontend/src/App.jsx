import '@mantine/core/styles.css';
import {MantineProvider} from "@mantine/core";
import theme from "@/components/theme/Theme.jsx";
import {Router} from "@/Router.jsx";
import Helmet from "@/components/Helmet.jsx";

function App() {

  return (
   <MantineProvider theme={theme} defaultColorScheme="auto" withGlobalStyles withNormalizeCSS>
       <Helmet>
           <Router/>
       </Helmet>
   </MantineProvider>
  )
}

export default App
