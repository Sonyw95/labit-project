import {Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator} from "@mui/lab";
import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import {formatDate, fromToNow} from "../../../utils/formatUitls";


const Order = ({ item, isLast }) => {
    const { type, title, time } = item;
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot/>
                {isLast ? null : <TimelineConnector/> }
            </TimelineSeparator>

            <TimelineContent>
                <Typography variant={'subtitle2'}>{title}</Typography>
                <Typography variant={'caption'} sx={{color: 'text.secondary'}}>{formatDate(time)}</Typography>
            </TimelineContent>
        </TimelineItem>
    )
}
export default function WidgetTimeline({ title, subheader, list, ...other }) {
    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <CardContent
                sx={{
                    '& .MuiTimelineItem-missingOppositeContent:before': {
                        display: 'none',
                    },
                }}
            >
                <Timeline>
                    {list.map((item, index) => (
                        <Order key={item.id} item={item} isLast={index === list.length - 1} />
                    ))}
                </Timeline>
            </CardContent>
        </Card>
    );
}