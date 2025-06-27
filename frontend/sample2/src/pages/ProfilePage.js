import {Container, Grid2, Typography, useTheme} from "@mui/material";
import {Helmet} from "react-helmet-async";
import { faker } from '@faker-js/faker';
import WidgetTimeline from "../sections/main/profile/WidgetTimeline";
import WidgetIntroduce from "../sections/main/profile/WidgetIntroduce";
import WidgetNews from "../sections/main/profile/WidgetNews";


export default function ProfilePage() {
    const theme = useTheme();
    return (
        <>
            <Helmet>
                <title> Profile | LABIT </title>
            </Helmet>
            <Container maxWidth="xl">
                <Typography variant={'h5'} sx={ { mb: 5} }>
                    안녕하세요. LABIT 입니다.
                </Typography>

                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <WidgetIntroduce title={"안녕하세요"} subheader={"하하하"} contents={"CONTENT"}/>
                    </Grid2>

                    {/*<Grid2 size={{ xs: 12, sm: 6, md: 3 }} >*/}
                    {/*    <WidgetCard title="Weekly Sales" total={714000} color={'info'} icon={'ant-design:android-filled'}/>*/}
                    {/*</Grid2>*/}
                    {/*<Grid2 size={{ xs: 12, sm: 6, md: 3 }} >*/}
                    {/*    <WidgetCard title="Weekly Sales" total={714000} color={'info'} icon={'ant-design:android-filled'}/>*/}
                    {/*</Grid2>*/}
                    {/*<Grid2 size={{ xs: 12, sm: 6, md: 3 }} >*/}
                    {/*    <WidgetCard title="Weekly Sales" total={714000} color={'info'} icon={'ant-design:android-filled'}/>*/}
                    {/*</Grid2>*/}
                    {/*<Grid2 size={{ xs: 12, sm: 6, md: 3 }} >*/}
                    {/*    <WidgetCard title="Weekly Sales" total={714000} color={'info'} icon={'ant-design:android-filled'}/>*/}
                    {/*</Grid2>*/}

                    <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                        <WidgetNews
                            title="News Update"
                            list={[...Array(4)].map((_, index) => ({
                                id: faker.datatype.uuid(),
                                title: faker.name.jobTitle(),
                                description: faker.name.jobTitle(),
                                image: `/resources/images/covers/cover_${index + 1}.jpg`,
                                postedAt: faker.date.recent(),
                            }))}
                        >
                        </WidgetNews>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 6 }} >
                        <WidgetTimeline
                            title="Timeline"
                            list={[...Array(6)].map((_, index) => ({
                                id: faker.string.uuid(),
                                title: [
                                    '1983, orders, $4220',
                                    '12 Invoices have been paid',
                                    'Order #37745 from September',
                                    'New order placed #XF-2356',
                                    'New order placed #XF-2346',
                                ][index],
                                type: `order${index + 1}`,
                                time: faker.date.past(),
                            }))}
                        />
                    </Grid2>
                </Grid2>
            </Container>
        </>
    )
}