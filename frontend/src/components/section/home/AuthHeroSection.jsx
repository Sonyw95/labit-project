// AuthHeroSection.jsx - 로딩 및 에러 처리 추가
import { memo, useCallback, useMemo, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import {
    ActionIcon,
    Avatar,
    Box,
    Grid,
    Group,
    Stack,
    Text,
    Skeleton,
    Alert,
    Button
} from "@mantine/core";
import {
    IconBrandGithub,
    IconCalendar,
    IconMail,
    IconMapPin,
    IconUser,
    IconRefresh,
    IconAlertCircle
} from "@tabler/icons-react";

const AuthHeroSection = memo(({ adminInfo, isLoading, error, onRefresh }) => {
    const { themeColors } = useTheme();
    const avatarRef = useRef(null);
    const fallbackIndexRef = useRef(0);
    console.log()

    // 스타일 객체들을 메모이제이션
    const styles = useMemo(() => ({
        avatar: {
            border: `3px solid ${themeColors.primary}`,
        },
        nameText: {
            color: themeColors.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1.2,
        },
        roleText: {
            color: themeColors.primary,
        },
        bioText: {
            color: themeColors.subText,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        actionIcon: {
            borderColor: themeColors.border,
            color: themeColors.text,
            '&:hover': {
                backgroundColor: themeColors.hover,
                borderColor: themeColors.primary,
            }
        }
    }), [themeColors]);

    // 이벤트 핸들러를 useCallback으로 메모이제이션
    const handleAvatarError = useCallback((event) => {
        const img = event.currentTarget;
        const nextIndex = fallbackIndexRef.current;

        if (nextIndex < (adminInfo?.fallbackImages?.length || 0)) {
            fallbackIndexRef.current += 1;
            img.src = adminInfo.fallbackImages[nextIndex];
        } else {
            img.style.display = 'none';
            if (avatarRef.current) {
                const avatarDiv = avatarRef.current.querySelector('.mantine-Avatar-placeholder');
                if (avatarDiv) {
                    avatarDiv.style.display = 'flex';
                }
            }
        }
    }, [adminInfo?.fallbackImages]);

    // 에러 상태 렌더링
    if (error && !isLoading) {
        return (
            <Box p="3rem">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="관리자 정보 로드 실패"
                    color="red"
                    variant="outline"
                >
                    <Stack gap="sm">
                        <Text size="sm">{error}</Text>
                        {onRefresh && (
                            <Button
                                variant="outline"
                                size="xs"
                                leftSection={<IconRefresh size={14} />}
                                onClick={onRefresh}
                            >
                                다시 시도
                            </Button>
                        )}
                    </Stack>
                </Alert>
            </Box>
        );
    }

    // 로딩 상태 렌더링
    if (isLoading || !adminInfo) {
        return (
            <Box p="3rem">
                <Grid>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack gap="xl">
                            <Group gap="xl">
                                <Skeleton circle height={80} />
                                <Box>
                                    <Skeleton height={40} width={200} mb="xs" />
                                    <Skeleton height={24} width={150} mb="sm" />
                                    <Group gap="md">
                                        <Skeleton height={16} width={100} />
                                        <Skeleton height={16} width={120} />
                                    </Group>
                                </Box>
                            </Group>
                            <Skeleton height={60} />
                            <Group gap="md">
                                <Skeleton circle height={40} />
                                <Skeleton circle height={40} />
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Box>
        );
    }

    // 정상 데이터 렌더링
    return (
        <Box p="3rem">
            <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="xl">
                        <Group gap="xl">
                            <Avatar
                                ref={avatarRef}
                                src={adminInfo.profileImage}
                                alt={adminInfo.name}
                                size="xl"
                                style={styles.avatar}
                                onError={handleAvatarError}
                            >
                                <IconUser size={48} />
                            </Avatar>

                            <Box>
                                <Text size="2.5rem" fw={800} style={styles.nameText}>
                                    {adminInfo.name}
                                </Text>
                                <Text size="xl" fw={600} mt="xs" style={styles.roleText}>
                                    {adminInfo.role}
                                </Text>
                                <Group gap="md" mt="sm" c={themeColors.subText}>
                                    <Group gap="xs">
                                        <IconMapPin size={16} />
                                        <Text size="sm">{adminInfo.location}</Text>
                                    </Group>
                                    {adminInfo.startYear && (
                                        <Group gap="xs">
                                            <IconCalendar size={16} />
                                            <Text size="sm">{adminInfo.startYear}년부터</Text>
                                        </Group>
                                    )}
                                    {adminInfo.totalViews && (
                                        <Group gap="xs">
                                            <Text size="sm" fw={500}>
                                                총 조회수: {adminInfo.totalViews}
                                            </Text>
                                        </Group>
                                    )}
                                </Group>
                            </Box>
                        </Group>

                        {adminInfo.bio && (
                            <Text size="lg" lh={1.6} style={styles.bioText}>
                                {adminInfo.bio}
                            </Text>
                        )}

                        <Group gap="md">
                            {adminInfo.githubUrl && (
                                <ActionIcon
                                    component="a"
                                    href={adminInfo.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="lg"
                                    variant="outline"
                                    color="gray"
                                    style={styles.actionIcon}
                                    aria-label="GitHub 프로필"
                                >
                                    <IconBrandGithub size={20} />
                                </ActionIcon>
                            )}
                            {adminInfo.email && (
                                <ActionIcon
                                    component="a"
                                    href={`mailto:${adminInfo.email}`}
                                    size="lg"
                                    variant="outline"
                                    color="gray"
                                    style={styles.actionIcon}
                                    aria-label="이메일 보내기"
                                >
                                    <IconMail size={20} />
                                </ActionIcon>
                            )}
                        </Group>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Box>
    );
});

AuthHeroSection.displayName = 'AuthHeroSection';

export default AuthHeroSection;