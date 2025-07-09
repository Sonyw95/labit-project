import {ColorSchemeScript} from "@mantine/core";

export default function Helmet ({children}) {
    return(
        <>
            <meta charSet="utf-8"/>
            <title> LABit </title>
            <meta property="description" content="LABit"/>
            <meta property="og:description" content="LABit"/>
            <meta property="og:type" content="website"/>
            <meta property="og:site" content="website"/>
            <ColorSchemeScript defaultColorScheme="auto" />
            {children}
        </>
    )

}