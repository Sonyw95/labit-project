import {Card, styled} from "@mui/material";
import PropTypes from "prop-types";
import {alpha} from "@mui/material/styles";
import Icons from "../../../components/icon/icons";


const StyleIcon = styled('div')( ({theme}) => ({
    margin: 'auto',
    display:'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}) );
WidgetCard.prototype = {
    color: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    sx: PropTypes.object,
}


export default function WidgetCard({ title, total, icon, color = 'primary', sx, ...other }) {
    return (
        <Card
            sx={{
                py: 5,
                boxShadow: 0,
                textAlign: 'center',
                color: (theme) => theme.palette[color].darker,
                bgcolor: (theme) => theme.palette[color].lighter,
                ...sx,
            }}
            {...other}
        >
            <StyleIcon
                sx={{
                    color: (theme) => theme.palette[color].dark,
                    backgroundImage: (theme) => {

                    }
                }}
            >
                <Icons icon={icon} width={24} height={24} />
            </StyleIcon>

        </Card>

    )
}