import { Navigate, useLocation } from 'react-router-dom';
import {Alert, Button, Container, Group, Text} from '@mantine/core';
import React, {memo} from "react";
import useAuthStore from "../../stores/authStore.js";
import {useUserInfo} from "../../hooks/api/useApi.js";
import {IconHome, IconShieldLock} from "@tabler/icons-react";

const ProtectedRoute = memo(({ children, requiredRole = null })  => {
    const location = useLocation();
    const { isAuthenticated, isAdmin } = useAuthStore();
    const { data: user, isLoading } = useUserInfo();

    // 로딩 중인 경우
    if (isLoading) {
        return (
            <Container size="sm" py="xl">
                <Text ta="center">사용자 정보를 확인하는 중...</Text>
            </Container>
        );
    }

    // 인증되지 않은 경우
    if (!isAuthenticated) {
        return <Navigate to="/home" state={{ from: location }} replace />;
    }
    // 역할 확인이 필요한 경우
    if (requiredRole && isAdmin && user) {
        return children
    }
    return (
        <Container size="sm" py="xl">
            <Alert
                icon={<IconShieldLock size={16} />}
                color="red"
                variant="light"
                title="접근 권한이 없습니다"
            >
                <Text mb="md">
                    관리자 페이지에 접근하려면 관리자 권한이 필요합니다.
                </Text>
                <Group>
                    <Button
                        component="a"
                        href="/"
                        leftSection={<IconHome size={16} />}
                        variant="subtle"
                    >
                        홈으로 돌아가기
                    </Button>
                </Group>
            </Alert>
        </Container>
    );

});

export default ProtectedRoute;