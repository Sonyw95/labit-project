import {createTheme} from "@mantine/core";

const theme = createTheme({
    primaryColor: 'blue',
    fontFamily: 'Inter, sans-serif',
    headings: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '700',
    },
    colors: {
        brand: [
            '#e3f2fd',
            '#bbdefb',
            '#90caf9',
            '#64b5f6',
            '#42a5f5',
            '#2196f3',
            '#1e88e5',
            '#1976d2',
            '#1565c0',
            '#0d47a1'
        ]
    }
});

export default theme;