import {Box, Button, Card, CardHeader, Divider, Link, Stack, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {Icon} from "@iconify/react";
import {fromToNow} from "../../../utils/formatUitls";


Items.protoTypes = {
    news: PropTypes.shape({
        description: PropTypes.string,
        image: PropTypes.string,
        postedAt: PropTypes.instanceOf(Date),
        title: PropTypes.string,
    })
}
function Items( {news} ){
    const {description, id, image, postedAt, title} = news

    return(
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box component={"image"} alt={title} src={image} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />
            <Box sx={{ minWidth: 240, flexGrow: 1 }}>
                <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                    {title}
                </Link>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
                <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
                    {fromToNow(postedAt)}
                </Typography>
            </Box>

        </Stack>
    )
}


export default function WidgetNews( { title, subheader, list, ...other } ) {
    return(
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
            <Stack spacing={4} sx={{ p: 3, pr: 0}}>
                { list.map((news) => (
                    <Items key={news.id} news={news} />
                ))}
            </Stack>
            <Divider/>
            <Box sx={{ p: 2, textAlign: 'right' }}>
                <Button size="small" color="inherit" endIcon={<Icon icon={'eva:arrow-ios-forward-fill'} />}>
                    View all
                </Button>
            </Box>
        </Card>
    )
}