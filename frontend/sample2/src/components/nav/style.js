import {ListItemButton, ListItemIcon, styled} from "@mui/material";


export const StyleNavItem = styled( (props) => <ListItemButton disableGutters {...props}/>)(({theme}) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
}));

export const StyledNavIcon = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})
