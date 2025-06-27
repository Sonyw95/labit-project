import {Card, CardContent, CardHeader} from "@mui/material";


export default function WidgetIntroduce({title, subheader, contents}) {

    return(
        <Card>
            <CardHeader title={title} subheader={subheader} />
            <CardContent >{contents}</CardContent>
        </Card>
    )
}