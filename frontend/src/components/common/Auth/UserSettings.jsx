// import {memo, useState} from 'react';
// import {
//     Stack,
//     Group,
//     Avatar,
//     Text,
//     TextInput,
//     Button,
//     Card,
//     Divider,
//     Badge,
//     Alert,
//     ActionIcon,
// } from '@mantine/core';
// import {
//     IconUser,
//     IconMail,
//     IconCalendar,
//     IconShield,
//     IconInfoCircle,
//     IconEdit,
//     IconCheck,
//     IconX,
// } from '@tabler/icons-react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import {queryKeys} from "../../../hooks/api/useApi.js";
//
// const  UserSettings = memo(({ user, onClose }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editForm, setEditForm] = useState({
//         nickname: user?.nickname || '',
//         email: user?.email || '',
//     });
//
//     const queryClient = useQueryClient();
//
//     // 프로필 수정 뮤테이션 (실제 API 연동 시 구현)
//     const updateProfileMutation = useMutation({
//         mutationFn: (profileData) => {
//             // TODO: 실제 프로필 업데이트 API 호출
//             return Promise.resolve(profileData);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: queryKeys.userInfo });
//             setIsEditing(false);
//         },
//     });
//
//     const handleSave = () => {
//         updateProfileMutation.mutate(editForm);
//     };
//
//     const handleCancel = () => {
//         setEditForm({
//             nickname: user?.nickname || '',
//             email: user?.email || '',
//         });
//         setIsEditing(false);
//     };
//
//     const formatDate = (dateString) => {
//         if (!dateString) {
//             return '정보 없음';
//         }
//         return new Date(dateString).toLocaleDateString('ko-KR', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//         });
//     };
//
//     const getRoleBadgeColor = (role) => {
//         switch (role) {
//             case 'SUPER_ADMIN': return 'red';
//             case 'ADMIN': return 'orange';
//             default: return 'blue';
//         }
//     };
//
//     const getRoleLabel = (role) => {
//         switch (role) {
//             case 'SUPER_ADMIN': return '슈퍼관리자';
//             case 'ADMIN': return '관리자';
//             default: return '일반사용자';
//         }
//     };
//
//     return (
//         <Stack spacing="lg">
//             {/* 프로필 카드 */}
//             <Card withBorder padding="lg">
//                 <Group justify="space-between" mb="md">
//                     <Group>
//                         <Avatar
//                             src={user?.profileImage}
//                             alt={user?.nickname}
//                             size="xl"
//                         />
//                         <div>
//                             {isEditing ? (
//                                 <Stack spacing="xs">
//                                     <TextInput
//                                         placeholder="닉네임"
//                                         value={editForm.nickname}
//                                         onChange={(e) => setEditForm(prev => ({
//                                             ...prev,
//                                             nickname: e.target.value
//                                         }))}
//                                         size="sm"
//                                     />
//                                     <TextInput
//                                         placeholder="이메일"
//                                         value={editForm.email}
//                                         onChange={(e) => setEditForm(prev => ({
//                                             ...prev,
//                                             email: e.target.value
//                                         }))}
//                                         size="sm"
//                                     />
//                                 </Stack>
//                             ) : (
//                                 <>
//                                     <Text size="lg" fw={600}>
//                                         {user?.nickname}
//                                     </Text>
//                                     <Text size="sm" c="dimmed">
//                                         {user?.email}
//                                     </Text>
//                                 </>
//                             )}
//                         </div>
//                     </Group>
//
//                     {isEditing ? (
//                         <Group spacing="xs">
//                             <ActionIcon
//                                 color="green"
//                                 onClick={handleSave}
//                                 loading={updateProfileMutation.isLoading}
//                             >
//                                 <IconCheck size={16} />
//                             </ActionIcon>
//                             <ActionIcon
//                                 color="red"
//                                 onClick={handleCancel}
//                             >
//                                 <IconX size={16} />
//                             </ActionIcon>
//                         </Group>
//                     ) : (
//                         <ActionIcon
//                             variant="light"
//                             onClick={() => setIsEditing(true)}
//                         >
//                             <IconEdit size={16} />
//                         </ActionIcon>
//                     )}
//                 </Group>
//
//                 <Badge
//                     color={getRoleBadgeColor(user?.role)}
//                     variant="light"
//                     leftSection={<IconShield size={12} />}
//                 >
//                     {getRoleLabel(user?.role)}
//                 </Badge>
//             </Card>
//
//             {/* 계정 정보 */}
//             <Card withBorder padding="lg">
//                 <Text size="md" fw={500} mb="md">
//                     계정 정보
//                 </Text>
//
//                 <Stack spacing="md">
//                     <Group>
//                         <IconUser size={16} color="gray" />
//                         <div>
//                             <Text size="sm" c="dimmed">사용자 ID</Text>
//                             <Text size="sm">{user?.id}</Text>
//                         </div>
//                     </Group>
//
//                     <Group>
//                         <IconMail size={16} color="gray" />
//                         <div>
//                             <Text size="sm" c="dimmed">카카오 ID</Text>
//                             <Text size="sm">{user?.kakaoId}</Text>
//                         </div>
//                     </Group>
//
//                     <Group>
//                         <IconCalendar size={16} color="gray" />
//                         <div>
//                             <Text size="sm" c="dimmed">가입일</Text>
//                             <Text size="sm">{formatDate(user?.createdDate)}</Text>
//                         </div>
//                     </Group>
//
//                     <Group>
//                         <IconCalendar size={16} color="gray" />
//                         <div>
//                             <Text size="sm" c="dimmed">최근 로그인</Text>
//                             <Text size="sm">{formatDate(user?.lastLoginDate)}</Text>
//                         </div>
//                     </Group>
//                 </Stack>
//             </Card>
//
//             {/* 계정 상태 */}
//             <Alert
//                 icon={<IconInfoCircle size={16} />}
//                 color={user?.isActive ? 'green' : 'red'}
//                 title="계정 상태"
//             >
//                 {user?.isActive ? '활성 계정입니다.' : '비활성 계정입니다.'}
//             </Alert>
//
//             <Divider />
//
//             {/* 액션 버튼들 */}
//             <Group justify="flex-end">
//                 <Button variant="outline" onClick={onClose}>
//                     닫기
//                 </Button>
//             </Group>
//         </Stack>
//     );
// })
//
// export default UserSettings;



import {memo, useState} from "react";
import {
    Avatar, Badge,
    Button,
    Card,
    Grid,
    Group,
    PasswordInput,
    Stack,
    Switch,
    Tabs,
    Textarea,
    TextInput,
    Title,
    Text, Modal
} from "@mantine/core";
import {
    IconCamera,
    IconCheck,
    IconKey, IconMail,
    IconShield,
    IconTrash,
    IconUser
} from "@tabler/icons-react";
import {DatePickerInput} from "@mantine/dates";
import dayjs from "dayjs";

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
    const handleSave = () => {
    };
    return (
        <Modal opened={opened} onClose={onClose} size="lg">
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List grow>
                    <Tabs.Tab value="profile" leftSection={<IconUser size={16}/>}>
                        프로필
                    </Tabs.Tab>
                    <Tabs.Tab value="security" leftSection={<IconShield size={16}/>}>
                        보안
                    </Tabs.Tab>
                    {/*<Tabs.Tab value="notifications" leftSection={<IconBell size={16}/>}>*/}
                    {/*    알림*/}
                    {/*</Tabs.Tab>*/}
                    {/*<Tabs.Tab value="preferences" leftSection={<IconPalette size={16}/>}>*/}
                    {/*    환경설정*/}
                    {/*</Tabs.Tab>*/}
                </Tabs.List>

                {/* 프로필 탭 */}
                <Tabs.Panel value="profile" pt="lg">
                    <Stack gap="lg">
                        {/* 프로필 이미지 섹션 */}
                        <Card withBorder radius="md" p="lg">
                            <Group>
                                <Avatar src={user.profileImage} size="xl" radius="md"/>
                                <Stack gap="xs" style={{flex: 1}}>
                                    <Text fw={600}>프로필 사진</Text>
                                    <Text size="sm" c="dimmed">
                                        JPG, PNG 파일을 업로드하세요. 최대 5MB까지 지원합니다.
                                    </Text>
                                    <Group gap="xs">
                                        <Button variant="light" size="xs" leftSection={<IconCamera size={14}/>}>
                                            사진 변경
                                        </Button>
                                        <Button variant="subtle" size="xs" color="red" leftSection={<IconTrash size={14}/>}>
                                            삭제
                                        </Button>
                                    </Group>
                                </Stack>
                            </Group>
                        </Card>

                        {/* 기본 정보 */}
                        <Card withBorder radius="md" p="lg">
                            <Title order={4} mb="md">기본 정보</Title>
                            <Grid>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="이름"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        leftSection={<IconUser size={16}/>}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="이메일"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        leftSection={<IconMail size={16}/>}
                                    />
                                </Grid.Col>
                                {

                                    user.role.toLowerCase().includes('admin') && (
                                       <>
                                           <Grid.Col span={12}>
                                               <DatePickerInput
                                                   defaultValue={dayjs().format('YYYY-MM-DD')}
                                                   label="개발 시작일"
                                                   placeholder="개발 시작일"
                                               />
                                           </Grid.Col>
                                           <Grid.Col span={12}>
                                               <Textarea
                                                   label="자기소개"
                                                   value={formData.bio}
                                                   onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                                   rows={3}
                                                   maxLength={200}
                                               />
                                           </Grid.Col>

                                       </>
                                    )
                                }
                                <Grid.Col span={12}>
                                    <Button fullWidth variant="light" leftSection={<IconCheck size={16}/>}>
                                        정보 변경
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        </Card>

                    </Stack>
                </Tabs.Panel>

                {/* 보안 탭 */}
                <Tabs.Panel value="security" pt="lg">
                    <Stack gap="lg">
                        <Card withBorder radius="md" p="lg">
                            <Title order={4} mb="md">비밀번호 변경</Title>
                            <Stack gap="md">
                                <PasswordInput
                                    label="현재 비밀번호"
                                    placeholder="현재 비밀번호를 입력하세요"
                                />
                                <PasswordInput
                                    label="새 비밀번호"
                                    placeholder="새 비밀번호를 입력하세요"
                                />
                                <PasswordInput
                                    label="새 비밀번호 확인"
                                    placeholder="새 비밀번호를 다시 입력하세요"
                                />
                                <Button variant="light" leftSection={<IconKey size={16}/>}>
                                    비밀번호 변경
                                </Button>
                            </Stack>
                        </Card>

                        {/*<Card withBorder radius="md" p="lg">*/}
                        {/*    <Title order={4} mb="md">2단계 인증</Title>*/}
                        {/*    <Group justify="space-between" mb="md">*/}
                        {/*        <div>*/}
                        {/*            <Text fw={500}>2단계 인증 활성화</Text>*/}
                        {/*            <Text size="sm" c="dimmed">*/}
                        {/*                계정 보안을 강화하기 위해 2단계 인증을 설정하세요*/}
                        {/*            </Text>*/}
                        {/*        </div>*/}
                        {/*        <Switch size="md"/>*/}
                        {/*    </Group>*/}
                        {/*    <Button variant="outline" size="sm">*/}
                        {/*        인증 앱 설정*/}
                        {/*    </Button>*/}
                        {/*</Card>*/}

                        {/*<Card withBorder radius="md" p="lg">*/}
                        {/*    <Title order={4} mb="md">활성 세션</Title>*/}
                        {/*    <Stack gap="md">*/}
                        {/*        <Group justify="space-between">*/}
                        {/*            <div>*/}
                        {/*                <Text fw={500}>현재 세션 (Chrome, Windows)</Text>*/}
                        {/*                <Text size="sm" c="dimmed">서울, 대한민국 • 지금</Text>*/}
                        {/*            </div>*/}
                        {/*            <Badge color="green">현재</Badge>*/}
                        {/*        </Group>*/}
                        {/*        <Group justify="space-between">*/}
                        {/*            <div>*/}
                        {/*                <Text fw={500}>Mobile App (iOS)</Text>*/}
                        {/*                <Text size="sm" c="dimmed">서울, 대한민국 • 2시간 전</Text>*/}
                        {/*            </div>*/}
                        {/*            <Button variant="subtle" color="red" size="xs">*/}
                        {/*                종료*/}
                        {/*            </Button>*/}
                        {/*        </Group>*/}
                        {/*    </Stack>*/}
                        {/*</Card>*/}
                    </Stack>
                </Tabs.Panel>

                {/* 알림 탭 */}
                {/*<Tabs.Panel value="notifications" pt="lg">*/}
                {/*    <Stack gap="lg">*/}
                {/*        <Card withBorder radius="md" p="lg">*/}
                {/*            <Title order={4} mb="md">이메일 알림</Title>*/}
                {/*            <Stack gap="md">*/}
                {/*                <Group justify="space-between">*/}
                {/*                    <div>*/}
                {/*                        <Text fw={500}>새 댓글 알림</Text>*/}
                {/*                        <Text size="sm" c="dimmed">내 게시물에 새 댓글이 달릴 때</Text>*/}
                {/*                    </div>*/}
                {/*                    <Switch defaultChecked/>*/}
                {/*                </Group>*/}
                {/*                <Group justify="space-between">*/}
                {/*                    <div>*/}
                {/*                        <Text fw={500}>좋아요 알림</Text>*/}
                {/*                        <Text size="sm" c="dimmed">내 게시물이나 댓글에 좋아요가 달릴 때</Text>*/}
                {/*                    </div>*/}
                {/*                    <Switch defaultChecked/>*/}
                {/*                </Group>*/}
                {/*                <Group justify="space-between">*/}
                {/*                    <div>*/}
                {/*                        <Text fw={500}>새 팔로워 알림</Text>*/}
                {/*                        <Text size="sm" c="dimmed">새로운 팔로워가 생겼을 때</Text>*/}
                {/*                    </div>*/}
                {/*                    <Switch/>*/}
                {/*                </Group>*/}
                {/*            </Stack>*/}
                {/*        </Card>*/}

                {/*        <Card withBorder radius="md" p="lg">*/}
                {/*            <Title order={4} mb="md">푸시 알림</Title>*/}
                {/*            <Stack gap="md">*/}
                {/*                <Group justify="space-between">*/}
                {/*                    <div>*/}
                {/*                        <Text fw={500}>브라우저 알림</Text>*/}
                {/*                        <Text size="sm" c="dimmed">브라우저에서 알림을 받습니다</Text>*/}
                {/*                    </div>*/}
                {/*                    <Switch defaultChecked/>*/}
                {/*                </Group>*/}
                {/*                <Group justify="space-between">*/}
                {/*                    <div>*/}
                {/*                        <Text fw={500}>모바일 알림</Text>*/}
                {/*                        <Text size="sm" c="dimmed">모바일 앱에서 알림을 받습니다</Text>*/}
                {/*                    </div>*/}
                {/*                    <Switch defaultChecked/>*/}
                {/*                </Group>*/}
                {/*            </Stack>*/}
                {/*        </Card>*/}
                {/*    </Stack>*/}
                {/*</Tabs.Panel>*/}

                {/* 환경설정 탭 */}
                {/*<Tabs.Panel value="preferences" pt="lg">*/}
                {/*    <Stack gap="lg">*/}
                {/*        /!*<Card withBorder radius="md" p="lg">*!/*/}
                {/*        /!*    <Title order={4} mb="md">테마 설정</Title>*!/*/}
                {/*        /!*    <Stack gap="md">*!/*/}
                {/*        /!*        <Group justify="space-between">*!/*/}
                {/*        /!*            <div>*!/*/}
                {/*        /!*                <Text fw={500}>다크 모드</Text>*!/*/}
                {/*        /!*                <Text size="sm" c="dimmed">어두운 테마를 사용합니다</Text>*!/*/}
                {/*        /!*            </div>*!/*/}
                {/*        /!*            <Switch/>*!/*/}
                {/*        /!*        </Group>*!/*/}
                {/*        /!*        <Select*!/*/}
                {/*        /!*            label="언어"*!/*/}
                {/*        /!*            value="ko"*!/*/}
                {/*        /!*            data={[*!/*/}
                {/*        /!*                {value: 'ko', label: '한국어'},*!/*/}
                {/*        /!*                {value: 'en', label: 'English'},*!/*/}
                {/*        /!*                {value: 'ja', label: '日本語'},*!/*/}
                {/*        /!*            ]}*!/*/}
                {/*        /!*        />*!/*/}
                {/*        /!*    </Stack>*!/*/}
                {/*        /!*</Card>*!/*/}

                {/*        <Card withBorder radius="md" p="lg">*/}
                {/*            <Title order={4} mb="md">개인정보 설정</Title>*/}
                {/*            <Stack gap="md">*/}
                {/*                <Group justify="space-between">*/}
                {/*                    <div>*/}
                {/*                        <Text fw={500}>프로필 공개</Text>*/}
                {/*                        <Text size="sm" c="dimmed">다른 사용자가 내 프로필을 볼 수 있습니다</Text>*/}
                {/*                    </div>*/}
                {/*                    <Switch defaultChecked/>*/}
                {/*                </Group>*/}
                {/*                <Group justify="space-between">*/}
                {/*                    <div>*/}
                {/*                        <Text fw={500}>온라인 상태 표시</Text>*/}
                {/*                        <Text size="sm" c="dimmed">다른 사용자에게 온라인 상태를 표시합니다</Text>*/}
                {/*                    </div>*/}
                {/*                    <Switch defaultChecked/>*/}
                {/*                </Group>*/}
                {/*                <Group justify="space-between">*/}
                {/*                    <div>*/}
                {/*                        <Text fw={500}>이메일 공개</Text>*/}
                {/*                        <Text size="sm" c="dimmed">프로필에서 이메일 주소를 공개합니다</Text>*/}
                {/*                    </div>*/}
                {/*                    <Switch/>*/}
                {/*                </Group>*/}
                {/*            </Stack>*/}
                {/*        </Card>*/}
                {/*    </Stack>*/}
                {/*</Tabs.Panel>*/}

                {/* 저장 버튼 */}
                {/*<Group justify="flex-end" mt="xl">*/}
                {/*    <Button variant="outline">*/}
                {/*        취소*/}
                {/*    </Button>*/}
                {/*    <Button onClick={handleSave} leftSection={<IconCheck size={16}/>}>*/}
                {/*        저장*/}
                {/*    </Button>*/}
                {/*</Group>*/}
            </Tabs>
        </Modal>
    );
});

export default UserSettings;