import { Navigate, useLocation } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import {memo} from "react";
import useAuthStore from "../../stores/authStore.js";
import {useUserInfo} from "../../hooks/api/useApi.js";

const ProtectedRoute = memo(({ children, requiredRole = null })  => {
    const location = useLocation();
    const { isAuthenticated } = useAuthStore();
    const { data: user, isLoading } = useUserInfo();

    // 로딩 중
    if (isLoading) {
        return (
            <Center h="50vh">
                <Loader size="lg" />
            </Center>
        );
    }

    // 인증되지 않은 경우
    if (!isAuthenticated) {
        return <Navigate to="/home" state={{ from: location }} replace />;
    }

    // 역할 확인이 필요한 경우
    if (requiredRole && user) {
        const hasRequiredRole = useAuthStore.getState().hasRole(requiredRole);
        if (!hasRequiredRole) {
            return <Navigate to="/home" state={{ from: location }} replace />;
        }
    }

    return children;
});

export default ProtectedRoute;