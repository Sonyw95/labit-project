import React, {useState, useEffect, memo} from 'react';
import {
    Container,
    Title,
    Text,
    Button,
    Stack,
    Box,
    Group,
    Transition,
    Flex,
} from '@mantine/core';
import {Icons} from "@/utils/Icons.jsx";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {isRouteErrorResponse, useParams, useRouteError} from "react-router-dom";
import {IconHome, IconRefresh} from "@tabler/icons-react";


const errorPages = {
    '401': {
        title: '인증이 필요합니다',
        description: '이 페이지에 접근하려면 로그인이 필요합니다. 계정이 있으시다면 로그인 후 다시 시도해 주세요.',
        icon: 'IconLock',
        color: 'orange'
    },
    '403': {
        title: '접근이 금지되었습니다',
        description: '이 페이지에 접근할 권한이 없습니다. 필요한 권한을 확인하거나 관리자에게 문의해 주세요.',
        icon: 'IconShieldX',
        color: 'red'
    },
    '404': {
        title: '페이지를 찾을 수 없습니다',
        description: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다. URL을 다시 확인해 주세요.',
        icon: 'IconError404',
        color: 'blue'
    },
    '500': {
        title: '서버 내부 오류',
        description: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주시거나 관리자에게 문의해 주세요.',
        icon: 'IconServerOff',
        color: 'grape'
    },
    '502': {
        title: '게이트웨이 오류',
        description: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        icon: 'IconNetworkOff',
        color: 'teal'
    }
};
// Floating Animation Component (2025 trend)
const FloatingElement = ({ children, delay = 0 }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Box
            style={{
                animation: mounted ? `float 6s ease-in-out infinite ${delay}s` : 'none',
                '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' }
                }
            }}
        >
            {children}
        </Box>
    );
};

// Micro Animation Component
const PulsingIcon = ({ icon: Icon }) => {
    return (
        <Icons icon={Icon} size={ 100 }/>
    );
};

// Error Page Component
const ErrorPage = memo(() => {
    const [mounted, setMounted] = useState(false);

    const error = useRouteError();
    const params = useParams();

    // 1. status 코드 판별
    const statusCode = params.code || (
        isRouteErrorResponse(error)
            ? error.status
            : error?.response?.status || 500
    ).toString();

    // 2. 에러 페이지 정보 매핑
    const { title, description, icon} = errorPages[statusCode] || {
        title: '알 수 없는 오류',
        description: error?.message || '예기치 않은 문제가 발생했습니다.',
        icon: 'IconAlertCircle',
        color: 'gray'
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const { themeColors: currentTheme } = useTheme();

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${currentTheme.background} 0%, ${currentTheme.surface} 100%)`,
                position: 'relative',
                color: currentTheme.text
            }}
        >
            {/* Global Styles */}
            <style>
                {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .slide-up {
            animation: slideUp 0.8s ease-out;
          }
        `}
            </style>

            <Container size="md" style={{paddingTop: '10vh'}}>
                <Flex direction="column" align="center" justify="center" style={{minHeight: '80vh'}}>
                    <Transition mounted={mounted} transition="slide-up" duration={800}>
                        {(styles) => (
                            <Stack align="center" spacing="xl" style={styles}>
                                {/* Floating Icon */}
                                <FloatingElement delay={0}>
                                    <PulsingIcon icon={icon} />
                                </FloatingElement>

                                {/* Error Code with 2025 Typography Trend */}
                                <FloatingElement delay={0.2}>
                                    <Title
                                        order={1}
                                        style={{
                                            fontSize: '8rem',
                                            fontWeight: 900,
                                            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            textAlign: 'center',
                                            lineHeight: 1,
                                            letterSpacing: '-0.05em'
                                        }}
                                    >
                                        {statusCode}
                                    </Title>
                                </FloatingElement>

                                {/* Title */}
                                <FloatingElement delay={0.4}>
                                    <Title
                                        order={2}
                                        style={{
                                            fontSize: '2.5rem',
                                            fontWeight: 700,
                                            color: currentTheme.text,
                                            textAlign: 'center',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        {title}
                                    </Title>
                                </FloatingElement>

                                {/* Description */}
                                <FloatingElement delay={0.6}>
                                    <Text
                                        size="lg"
                                        style={{
                                            color: currentTheme.textSecondary,
                                            textAlign: 'center',
                                            maxWidth: '500px',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {description}
                                    </Text>
                                </FloatingElement>

                                {/* Action Buttons */}
                                <FloatingElement delay={0.8}>
                                    <Group spacing="md" style={{marginTop: '2rem'}}>
                                        <Button
                                            size="lg"
                                            variant="filled"
                                            leftSection={<IconHome size={20} />}
                                            style={{
                                                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '12px 24px',
                                                fontWeight: 600,
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 8px 25px ${currentTheme.primary}40`
                                                }
                                            }}
                                            onClick={() => window.location.href = '/'}
                                        >
                                            홈으로 가기
                                        </Button>

                                        <Button
                                            size="lg"
                                            variant="outline"
                                            leftSection={<IconRefresh size={20} />}
                                            style={{
                                                borderColor: currentTheme.primary,
                                                color: currentTheme.primary,
                                                borderRadius: '12px',
                                                padding: '12px 24px',
                                                fontWeight: 600,
                                                fontSize: '16px',
                                                background: 'transparent',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: currentTheme.primary,
                                                    color: 'white',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                            onClick={() => window.location.reload()}
                                        >
                                            새로고침
                                        </Button>
                                    </Group>
                                </FloatingElement>
                            </Stack>
                        )}
                    </Transition>
                </Flex>
            </Container>
        </Box>
    );
});

export default ErrorPage;