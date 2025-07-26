import {memo, useCallback, useMemo, useRef} from "react";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {ActionIcon, Avatar, Box, Grid, Group, Stack, Text} from "@mantine/core";
import {IconBrandGithub, IconCalendar, IconMail, IconMapPin, IconUser} from "@tabler/icons-react";

const AuthHeroSection = memo(({ adminInfo }) => {
    const { velogColors } = useTheme();
    const avatarRef = useRef(null);
    const fallbackIndexRef = useRef(0);

    // 스타일 객체들을 메모이제이션
    const styles = useMemo(() => ({
        avatar: {
            border: `3px solid ${velogColors.primary}`,
        },
        nameText: {
            color: velogColors.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1.2,
        },
        roleText: {
            color: velogColors.primary,
        },
        bioText: {
            color: velogColors.subText,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        actionIcon: {
            borderColor: velogColors.border,
            color: velogColors.text,
            '&:hover': {
                backgroundColor: velogColors.hover,
                borderColor: velogColors.primary,
            }
        }
    }), [velogColors]);

    // 이벤트 핸들러를 useCallback으로 메모이제이션
    const handleAvatarError = useCallback((event) => {
        const img = event.currentTarget;
        const nextIndex = fallbackIndexRef.current;

        if (nextIndex < (adminInfo.fallbackImages?.length || 0)) {
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
    }, [adminInfo.fallbackImages]);

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
                                <Group gap="md" mt="sm" c={velogColors.subText}>
                                    <Group gap="xs">
                                        <IconMapPin size={16} />
                                        <Text size="sm">{adminInfo.location}</Text>
                                    </Group>
                                    <Group gap="xs">
                                        <IconCalendar size={16} />
                                        <Text size="sm">2020년부터</Text>
                                    </Group>
                                </Group>
                            </Box>
                        </Group>

                        <Text size="lg" lh={1.6} style={styles.bioText}>
                            {adminInfo.bio}
                        </Text>

                        <Group gap="md">
                            <ActionIcon
                                component="a"
                                href={adminInfo.github}
                                target="_blank"
                                size="lg"
                                variant="outline"
                                color="gray"
                                style={styles.actionIcon}
                            >
                                <IconBrandGithub size={20} />
                            </ActionIcon>
                            <ActionIcon
                                component="a"
                                href={`mailto:${adminInfo.email}`}
                                size="lg"
                                variant="outline"
                                color="gray"
                                style={styles.actionIcon}
                            >
                                <IconMail size={20} />
                            </ActionIcon>
                        </Group>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Box>
    );
});

AuthHeroSection.displayName = 'AuthHeroSection';


export default AuthHeroSection;