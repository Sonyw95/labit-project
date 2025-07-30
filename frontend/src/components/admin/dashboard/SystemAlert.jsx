import React, { memo, useMemo, useCallback } from 'react';
import { Alert, Group, Stack, Text, Button } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const SystemAlert = memo(({
                              systemStatus,
                              themeColors
                          }) => {
    const alertStyles = useMemo(() => ({
        root: {
            backgroundColor: `${themeColors.error}10`,
            border: `1px solid ${themeColors.error}30`,
        },
        message: {
            color: themeColors.text,
        }
    }), [themeColors]);

    const buttonStyles = useMemo(() => ({
        borderColor: themeColors.error,
        color: themeColors.error,
        backgroundColor: 'transparent',
    }), [themeColors]);

    const handleButtonMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = `${themeColors.error}15`;
    }, [themeColors]);

    const handleButtonMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
    }, [themeColors]);

    const handleDetailsClick = useCallback(() => {
        // 시스템 상세 정보 모달 열기 등의 로직
        console.log('시스템 상세 정보 보기');
    }, []);

    if (systemStatus === 'healthy') {
        return null;
    }

    return (
        <Alert
            icon={<IconAlertCircle size={18} aria-hidden="true" />}
            color="red"
            variant="light"
            radius="md"
            styles={alertStyles}
            role="alert"
            aria-live="assertive"
        >
            <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                    <Text
                        fw={600}
                        style={{ color: themeColors.text }}
                        id="alert-title"
                    >
                        시스템 문제 감지
                    </Text>
                    <Text
                        size="sm"
                        style={{ color: themeColors.text }}
                        id="alert-description"
                    >
                        일부 서비스에 문제가 발생했습니다. 시스템 관리자에게 문의하세요.
                    </Text>
                </Stack>
                <Button
                    variant="outline"
                    size="sm"
                    radius="md"
                    style={buttonStyles}
                    onMouseEnter={handleButtonMouseEnter}
                    onMouseLeave={handleButtonMouseLeave}
                    onClick={handleDetailsClick}
                    aria-describedby="alert-title alert-description"
                >
                    자세히 보기
                </Button>
            </Group>
        </Alert>
    );
});

SystemAlert.displayName = 'SystemAlert';

export default SystemAlert;