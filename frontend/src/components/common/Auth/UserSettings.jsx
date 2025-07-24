import {memo, useState} from "react";
import {
    Avatar,
    Button,
    Grid,
    Group,
    PasswordInput,
    Stack,
    Tabs,
    Textarea,
    TextInput,
    Title,
    Text,
    Modal,
    Box,
} from "@mantine/core";
import {
    IconCamera,
    IconCheck,
    IconKey,
    IconMail,
    IconShield,
    IconTrash,
    IconUser
} from "@tabler/icons-react";
import {DatePickerInput} from "@mantine/dates";
import dayjs from "dayjs";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const UserSettings = memo(({
                               opened,
                               onClose,
                               user
                           }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user?.nickname,
        email: user?.email,
    });
    const { dark } = useTheme();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: dark ? '#ECECEC' : '#212529',
        subText: dark ? '#ADB5BD' : '#495057',
        background: dark ? '#1A1B23' : '#FFFFFF',
        border: dark ? '#2B2D31' : '#E9ECEF',
        hover: dark ? '#2B2D31' : '#F8F9FA',
        cardBg: dark ? '#1E1F25' : '#FAFAFA',
        inputBg: dark ? '#2B2D31' : '#FFFFFF',
    };

    const handleSave = () => {
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="xl"
            title={
                <Text
                    size="1.5rem"
                    fw={700}
                    c={velogColors.text}
                    style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    계정 설정
                </Text>
            }
            styles={{
                content: {
                    backgroundColor: velogColors.background,
                    border: `1px solid ${velogColors.border}`,
                    borderRadius: '16px',
                },
                header: {
                    backgroundColor: 'transparent',
                    borderBottom: `1px solid ${velogColors.border}`,
                },
                body: {
                    padding: '0',
                },
                close: {
                    color: velogColors.subText,
                    '&:hover': {
                        backgroundColor: velogColors.hover,
                    }
                }
            }}
        >
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                styles={{
                    root: {
                        backgroundColor: velogColors.background,
                    },
                    list: {
                        borderBottom: `1px solid ${velogColors.border}`,
                        backgroundColor: velogColors.cardBg,
                        padding: '0 1.5rem',
                    },
                    tab: {
                        color: velogColors.subText,
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        '&:hover': {
                            backgroundColor: velogColors.hover,
                            color: velogColors.text,
                        },
                        '&[data-active]': {
                            color: velogColors.primary,
                            borderBottomColor: velogColors.primary,
                        }
                    },
                    panel: {
                        padding: '1.5rem',
                    }
                }}
            >
                <Tabs.List grow>
                    <Tabs.Tab value="profile" leftSection={<IconUser size={16}/>}>
                        프로필
                    </Tabs.Tab>
                    <Tabs.Tab value="security" leftSection={<IconShield size={16}/>}>
                        보안
                    </Tabs.Tab>
                </Tabs.List>

                {/* 프로필 탭 */}
                <Tabs.Panel value="profile" pt="lg">
                    <Stack gap="xl">
                        {/* 프로필 이미지 섹션 */}
                        <Box
                            p="xl"
                            style={{
                                backgroundColor: velogColors.cardBg,
                                border: `1px solid ${velogColors.border}`,
                                borderRadius: '12px',
                            }}
                        >
                            <Group align="flex-start">
                                <Avatar
                                    src={user.profileImage}
                                    size="xl"
                                    radius="md"
                                    style={{
                                        border: `2px solid ${velogColors.border}`
                                    }}
                                />
                                <Stack gap="md" style={{flex: 1}}>
                                    <Box>
                                        <Text
                                            fw={600}
                                            size="lg"
                                            c={velogColors.text}
                                            style={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }}
                                        >
                                            프로필 사진
                                        </Text>
                                        <Text
                                            size="sm"
                                            c={velogColors.subText}
                                            mt="xs"
                                            style={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }}
                                        >
                                            JPG, PNG 파일을 업로드하세요. 최대 5MB까지 지원합니다.
                                        </Text>
                                    </Box>
                                    <Group gap="sm">
                                        <Button
                                            variant="light"
                                            size="sm"
                                            leftSection={<IconCamera size={14}/>}
                                            style={{
                                                backgroundColor: `${velogColors.primary}15`,
                                                color: velogColors.primary,
                                                border: 'none',
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }}
                                        >
                                            사진 변경
                                        </Button>
                                        <Button
                                            variant="subtle"
                                            size="sm"
                                            color="red"
                                            leftSection={<IconTrash size={14}/>}
                                            style={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }}
                                        >
                                            삭제
                                        </Button>
                                    </Group>
                                </Stack>
                            </Group>
                        </Box>

                        {/* 기본 정보 */}
                        <Box
                            p="xl"
                            style={{
                                backgroundColor: velogColors.cardBg,
                                border: `1px solid ${velogColors.border}`,
                                borderRadius: '12px',
                            }}
                        >
                            <Title
                                order={4}
                                mb="lg"
                                c={velogColors.text}
                                style={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                            >
                                기본 정보
                            </Title>
                            <Grid>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="이름"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        leftSection={<IconUser size={16}/>}
                                        styles={{
                                            input: {
                                                backgroundColor: velogColors.inputBg,
                                                border: `1px solid ${velogColors.border}`,
                                                borderRadius: '8px',
                                                color: velogColors.text,
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                '&:focus': {
                                                    borderColor: velogColors.primary,
                                                }
                                            },
                                            label: {
                                                color: velogColors.text,
                                                fontWeight: 600,
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }
                                        }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="이메일"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        leftSection={<IconMail size={16}/>}
                                        styles={{
                                            input: {
                                                backgroundColor: velogColors.inputBg,
                                                border: `1px solid ${velogColors.border}`,
                                                borderRadius: '8px',
                                                color: velogColors.text,
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                '&:focus': {
                                                    borderColor: velogColors.primary,
                                                }
                                            },
                                            label: {
                                                color: velogColors.text,
                                                fontWeight: 600,
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }
                                        }}
                                    />
                                </Grid.Col>
                                {user.role.toLowerCase().includes('admin') && (
                                    <>
                                        <Grid.Col span={12}>
                                            <DatePickerInput
                                                defaultValue={dayjs().format('YYYY-MM-DD')}
                                                label="개발 시작일"
                                                placeholder="개발 시작일"
                                                styles={{
                                                    input: {
                                                        backgroundColor: velogColors.inputBg,
                                                        border: `1px solid ${velogColors.border}`,
                                                        borderRadius: '8px',
                                                        color: velogColors.text,
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                        '&:focus': {
                                                            borderColor: velogColors.primary,
                                                        }
                                                    },
                                                    label: {
                                                        color: velogColors.text,
                                                        fontWeight: 600,
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                    }
                                                }}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={12}>
                                            <Textarea
                                                label="자기소개"
                                                value={formData.bio}
                                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                                rows={4}
                                                maxLength={200}
                                                styles={{
                                                    input: {
                                                        backgroundColor: velogColors.inputBg,
                                                        border: `1px solid ${velogColors.border}`,
                                                        borderRadius: '8px',
                                                        color: velogColors.text,
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                        '&:focus': {
                                                            borderColor: velogColors.primary,
                                                        }
                                                    },
                                                    label: {
                                                        color: velogColors.text,
                                                        fontWeight: 600,
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                    }
                                                }}
                                            />
                                        </Grid.Col>
                                    </>
                                )}
                                <Grid.Col span={12}>
                                    <Button
                                        fullWidth
                                        leftSection={<IconCheck size={16}/>}
                                        size="md"
                                        style={{
                                            backgroundColor: velogColors.primary,
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            '&:hover': {
                                                backgroundColor: '#0CA678',
                                            }
                                        }}
                                    >
                                        정보 변경
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Stack>
                </Tabs.Panel>

                {/* 보안 탭 */}
                <Tabs.Panel value="security" pt="lg">
                    <Stack gap="xl">
                        <Box
                            p="xl"
                            style={{
                                backgroundColor: velogColors.cardBg,
                                border: `1px solid ${velogColors.border}`,
                                borderRadius: '12px',
                            }}
                        >
                            <Title
                                order={4}
                                mb="lg"
                                c={velogColors.text}
                                style={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                            >
                                비밀번호 변경
                            </Title>
                            <Stack gap="lg">
                                <PasswordInput
                                    label="현재 비밀번호"
                                    placeholder="현재 비밀번호를 입력하세요"
                                    styles={{
                                        input: {
                                            backgroundColor: velogColors.inputBg,
                                            border: `1px solid ${velogColors.border}`,
                                            borderRadius: '8px',
                                            color: velogColors.text,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            '&:focus': {
                                                borderColor: velogColors.primary,
                                            }
                                        },
                                        label: {
                                            color: velogColors.text,
                                            fontWeight: 600,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }
                                    }}
                                />
                                <PasswordInput
                                    label="새 비밀번호"
                                    placeholder="새 비밀번호를 입력하세요"
                                    styles={{
                                        input: {
                                            backgroundColor: velogColors.inputBg,
                                            border: `1px solid ${velogColors.border}`,
                                            borderRadius: '8px',
                                            color: velogColors.text,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            '&:focus': {
                                                borderColor: velogColors.primary,
                                            }
                                        },
                                        label: {
                                            color: velogColors.text,
                                            fontWeight: 600,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }
                                    }}
                                />
                                <PasswordInput
                                    label="새 비밀번호 확인"
                                    placeholder="새 비밀번호를 다시 입력하세요"
                                    styles={{
                                        input: {
                                            backgroundColor: velogColors.inputBg,
                                            border: `1px solid ${velogColors.border}`,
                                            borderRadius: '8px',
                                            color: velogColors.text,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            '&:focus': {
                                                borderColor: velogColors.primary,
                                            }
                                        },
                                        label: {
                                            color: velogColors.text,
                                            fontWeight: 600,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }
                                    }}
                                />
                                <Button
                                    leftSection={<IconKey size={16}/>}
                                    size="md"
                                    style={{
                                        backgroundColor: velogColors.primary,
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        '&:hover': {
                                            backgroundColor: '#0CA678',
                                        }
                                    }}
                                >
                                    비밀번호 변경
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
});

export default UserSettings;