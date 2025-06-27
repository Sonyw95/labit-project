export default function Tables(theme){
    return {
        MuiTableCell: {
            styleOverrides: {
                head:{
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.background.neutral,
                },
            },
        },
    };
}