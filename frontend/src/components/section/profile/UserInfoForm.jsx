import React, { useCallback, useMemo } from 'react';
import {
    Card,
    Group,
    Text,
    TextInput,
    Textarea,
    Stack,
    Badge,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
    IconEdit,
    IconMail,
    IconCalendar,
    IconPencil,
    IconUser,
} from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import {CONSTANTS, createCardStyles, createInputStyles, createReadOnlyInputStyles} from "@/utils/useEditStyle.js";

// 개별 입력 필드 컴포넌트들 - 리렌더링 최적화
const NicknameInput = React.memo(({
                                      value,
                                      onChange,
                                      error,
                                      disabled,
                                      inputStyles
                                  }) => {
    const { themeColors } = useTheme();

    const handleChange = useCallback((event) => {
        onChange(event.target.value);
    }, [onChange]);

    return (
        <TextInput
            label="닉네임"
            placeholder="닉네임을 입력하세요"
            value={value || ''}
            onChange={handleChange}
            error={error}
            disabled={disabled}
            leftSection={<IconEdit size={14} color={themeColors.subText} aria-hidden="true" />}
            styles={inputStyles}
            aria-describedby={error ? 'nickname-error' : 'nickname-help'}
            aria-invalid={!!error}
            maxLength={CONSTANTS.MAX_NICKNAME_LENGTH}
            required
        />
    );
});

const EmailInput = React.memo(({ value, readOnlyInputStyles }) => {
    const { themeColors } = useTheme();

    return (
        <TextInput
            label="이메일"
            value={value || ''}
            readOnly
            leftSection={<IconMail size={14} color={themeColors.subText} aria-hidden="true" />}
            rightSection={
                <Badge
                    size="xs"
                    styles={{
                        root: {
                            backgroundColor: themeColors.hover,
                            color: themeColors.subText
                        }
                    }}
                    aria-label="수정 불가능한 필드"
                >
                    수정불가
                </Badge>
            }
            styles={readOnlyInputStyles}
            aria-label="이메일 주소 (수정 불가)"
            aria-describedby="email-readonly-note"
        />
    );
});

const BioTextarea = React.memo(({
                                    value,
                                    onChange,
                                    error,
                                    disabled,
                                    inputStyles
                                }) => {
    const { themeColors } = useTheme();
    const currentLength = value?.length || 0;

    const handleChange = useCallback((event) => {
        const newValue = event.target.value;
        if (newValue.length <= CONSTANTS.MAX_BIO_LENGTH) {
            onChange(newValue);
        }
    }, [onChange]);

    const handleKeyDown = useCallback((event) => {
        // 길이 제한 도달 시 백스페이스, 삭제, 화살표 키만 허용
        if (currentLength >= CONSTANTS.MAX_BIO_LENGTH) {
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
            if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
            }
        }
    }, [currentLength]);

    return (
        <>
            <Textarea
                placeholder="자신을 소개해주세요..."
                value={value || ''}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={error}
                disabled={disabled}
                minRows={4}
                maxRows={8}
                autosize
                styles={inputStyles}
                aria-describedby="bio-counter bio-help"
                aria-invalid={!!error}
                maxLength={CONSTANTS.MAX_BIO_LENGTH}
            />
            <Text
                id="bio-counter"
                size="xs"
                c={currentLength > CONSTANTS.MAX_BIO_LENGTH * 0.9 ? themeColors.warning : themeColors.subText}
                aria-live="polite"
                role="status"
            >
                {currentLength}/{CONSTANTS.MAX_BIO_LENGTH}
                {currentLength > CONSTANTS.MAX_BIO_LENGTH * 0.9 &&
                    ` (${CONSTANTS.MAX_BIO_LENGTH - currentLength}자 남음)`
                }
            </Text>
        </>
    );
});

const DevStartDateInput = React.memo(({
                                          value,
                                          onChange,
                                          error,
                                          disabled,
                                          inputStyles
                                      }) => {
    const maxDate = useMemo(() => new Date(), []);

    return (
        <DateInput
            label="언제부터 개발을 시작하셨나요?"
            placeholder="날짜를 선택하세요"
            value={value}
            onChange={onChange}
            error={error}
            disabled={disabled}
            maxDate={maxDate}
            styles={inputStyles}
            aria-label="개발 시작 날짜 선택"
            aria-describedby={error ? 'dev-date-error' : 'dev-date-help'}
            aria-invalid={!!error}
            clearable
            firstDayOfWeek={0}
            locale="ko"
        />
    );
});

// 카드 섹션 컴포넌트들
const BasicInfoCard = React.memo(({ userInfo, onChange, errors, disabled, styles }) => {
    const { themeColors } = useTheme();

    const handleNicknameChange = useCallback((nickname) => {
        onChange({ ...userInfo, nickname });
    }, [userInfo, onChange]);

    return (
        <Card p="lg" radius="md" withBorder style={styles.card} role="region" aria-labelledby="basic-info-title">
            <Stack gap="md">
                <Group gap="xs" mb="sm">
                    <IconUser size={16} color={themeColors.primary} aria-hidden="true" />
                    <Text id="basic-info-title" fw={600} size="sm" c={themeColors.text}>
                        기본 정보
                    </Text>
                </Group>

                <NicknameInput
                    value={userInfo.nickname}
                    onChange={handleNicknameChange}
                    error={errors.nickname}
                    disabled={disabled}
                    inputStyles={styles.input}
                />

                <EmailInput
                    value={userInfo.email}
                    readOnlyInputStyles={styles.readonlyInput}
                />

                {/* 접근성을 위한 숨겨진 도움말 */}
                <div className="sr-only">
                    <div id="nickname-help">
                        닉네임은 {CONSTANTS.MIN_NICKNAME_LENGTH}자 이상 {CONSTANTS.MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.
                    </div>
                    <div id="email-readonly-note">
                        이메일 주소는 보안상의 이유로 수정할 수 없습니다.
                    </div>
                </div>
            </Stack>
        </Card>
    );
});

const AboutMeCard = React.memo(({ userInfo, onChange, errors, disabled, styles }) => {
    const { themeColors } = useTheme();

    const handleBioChange = useCallback((bio) => {
        onChange({ ...userInfo, bio });
    }, [userInfo, onChange]);

    return (
        <Card p="lg" radius="md" withBorder style={styles.card} role="region" aria-labelledby="about-me-title">
            <Stack gap="md">
                <Group gap="xs" mb="sm">
                    <IconPencil size={16} color={themeColors.primary} aria-hidden="true" />
                    <Text id="about-me-title" fw={600} size="sm" c={themeColors.text}>
                        자기소개
                    </Text>
                </Group>

                <BioTextarea
                    value={userInfo.bio}
                    onChange={handleBioChange}
                    error={errors.bio}
                    disabled={disabled}
                    inputStyles={styles.input}
                />

                {/* 접근성을 위한 숨겨진 도움말 */}
                <div id="bio-help" className="sr-only">
                    자기소개는 최대 {CONSTANTS.MAX_BIO_LENGTH}자까지 입력할 수 있습니다.
                </div>
            </Stack>
        </Card>
    );
});

const DevStartDateCard = React.memo(({ userInfo, onChange, errors, disabled, styles }) => {
    const { themeColors } = useTheme();

    const handleDateChange = useCallback((devStartDate) => {
        onChange({ ...userInfo, devStartDate });
    }, [userInfo, onChange]);

    return (
        <Card p="lg" radius="md" withBorder style={styles.card} role="region" aria-labelledby="dev-date-title">
            <Stack gap="md">
                <Group gap="xs" mb="sm">
                    <IconCalendar size={16} color={themeColors.primary} aria-hidden="true" />
                    <Text id="dev-date-title" fw={600} size="sm" c={themeColors.text}>
                        개발 시작일
                    </Text>
                </Group>

                <DevStartDateInput
                    value={userInfo.devStartDate}
                    onChange={handleDateChange}
                    error={errors.devStartDate}
                    disabled={disabled}
                    inputStyles={styles.input}
                />

                {/* 접근성을 위한 숨겨진 도움말 */}
                <div id="dev-date-help" className="sr-only">
                    개발을 시작한 날짜를 선택해주세요. 오늘 이후의 날짜는 선택할 수 없습니다.
                </div>
            </Stack>
        </Card>
    );
});

// 메인 사용자 정보 폼 컴포넌트
const UserInfoForm = React.memo(({
                                     userInfo,
                                     onChange,
                                     errors = {},
                                     disabled = false
                                 }) => {
    const { themeColors } = useTheme();

    // 스타일 메모이제이션
    const styles = useMemo(() => ({
        card: createCardStyles(themeColors),
        input: createInputStyles(themeColors),
        readonlyInput: createReadOnlyInputStyles(themeColors)
    }), [themeColors]);

    return (
        <Stack gap="md" role="form" aria-label="사용자 정보 수정 폼">
            <BasicInfoCard
                userInfo={userInfo}
                onChange={onChange}
                errors={errors}
                disabled={disabled}
                styles={styles}
            />

            <AboutMeCard
                userInfo={userInfo}
                onChange={onChange}
                errors={errors}
                disabled={disabled}
                styles={styles}
            />

            <DevStartDateCard
                userInfo={userInfo}
                onChange={onChange}
                errors={errors}
                disabled={disabled}
                styles={styles}
            />

            {/* 전역 스타일 - 접근성 개선 */}
            <style jsx global>{`
                .sr-only {
                    position: absolute !important;
                    width: 1px !important;
                    height: 1px !important;
                    padding: 0 !important;
                    margin: -1px !important;
                    overflow: hidden !important;
                    clip: rect(0, 0, 0, 0) !important;
                    white-space: nowrap !important;
                    border: 0 !important;
                }
            `}</style>
        </Stack>
    );
});

// displayName 설정
NicknameInput.displayName = 'NicknameInput';
EmailInput.displayName = 'EmailInput';
BioTextarea.displayName = 'BioTextarea';
DevStartDateInput.displayName = 'DevStartDateInput';
BasicInfoCard.displayName = 'BasicInfoCard';
AboutMeCard.displayName = 'AboutMeCard';
DevStartDateCard.displayName = 'DevStartDateCard';
UserInfoForm.displayName = 'UserInfoForm';

export default UserInfoForm;