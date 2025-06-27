import PropTypes from 'prop-types';
import {useMemo} from "react";

import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";

import palette from "./palette";
import typo from "./typo";
import CustomGlobalStyles from "./customGlobalStyles";
import greyShadow from "./greyShadow";
import customShadow from "./customShadow";
import overrideComponentTheme from "./override/overrideIndex";

/* MUI Theme Customize this Props Manage */
ThemeProvider.propTypes = {
    children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
    const themeOptions = useMemo(
        () => ({
            palette,
            shape: {borderRadius: 6},
            typo,
            shadows: greyShadow(),
            customShadows: customShadow(),
            width: {leftNavi: 220,}
        }),
        []
    );
    const theme = createTheme(themeOptions);
    theme.components = overrideComponentTheme(theme);

    return (
        <StyledEngineProvider injectFirst>
            <MUIThemeProvider theme={theme}>
                <CssBaseline/>
                <CustomGlobalStyles/>
                {children}
            </MUIThemeProvider>
        </StyledEngineProvider>
    );
};
