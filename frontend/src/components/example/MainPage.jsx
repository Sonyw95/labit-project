import {Alert, Card, Container, Grid, Loader, Text} from "@mantine/core";
import UserProfile from "@/components/example/UserProfile.jsx";
import PostList from "@/components/example/PostList.jsx";
import NotificationList from "@/components/example/NotificationList.jsx";
import {useMainPageData} from "@/hooks/api/useApi.js";

function MainPage() {
    const { data, isLoading, error } = useMainPageData();

    if (isLoading) {
        return (
            <Container>
                <Loader size="xl" style={{ display: 'block', margin: '50px auto' }} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert color="red" title="Error">
                    메인 페이지 데이터를 불러오는데 실패했습니다.
                </Alert>
            </Container>
        );
    }

    const { userInfo, postList, mainImage, notifications } = data || {};

    return (
        <Container size="lg">
            <Grid>
                {/* 메인 이미지 */}
                <Grid.Col span={12}>
                    {mainImage && (
                        <Card shadow="sm" padding="lg">
                            <Image
                                src={mainImage.url}
                                alt={mainImage.title || 'Featured Image'}
                                height={300}
                                fit="cover"
                            />
                        </Card>
                    )}
                </Grid.Col>

                {/* 사용자 정보 */}
                <Grid.Col span={4}>
                    <UserProfile userInfo={userInfo} />
                </Grid.Col>

                {/* 포스트 리스트 */}
                <Grid.Col span={5}>
                    <PostList posts={postList?.data || []} />
                </Grid.Col>

                {/* 알림 */}
                <Grid.Col span={3}>
                    <NotificationList notifications={notifications || []} />
                </Grid.Col>
            </Grid>
        </Container>
    );
}

export default MainPage;