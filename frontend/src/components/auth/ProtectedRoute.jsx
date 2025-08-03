import {Navigate, useLocation} from 'react-router-dom';
import {Text, Loader, Center, Stack, LoadingOverlay} from '@mantine/core';
import React, {memo, useEffect, useState} from "react";
import useAuthStore from "../../stores/authStore.js";
import {IconShieldLock} from "@tabler/icons-react";
import {showToast} from "../advanced/Toast.jsx";

const ProtectedRoute = memo(({
                                 children
                                 , requiredRole = false,
                             })  => {
    const {
        isAdmin,
        isLoading,
        getUser,
        user,
    } = useAuthStore();
    // 앱 시작시 토큰 유효성 검사 및 자동 갱신
    const location = useLocation();
    console.log(`isAdmin=${isAdmin} :: requiredRole=${requiredRole}`)
    // 로딩 중인 경우
    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader size="lg" />
                <Text ml="md">인증 정보를 확인하는 중...</Text>
            </Center>
        );
    }
    if( requiredRole && !isAdmin  ){
        showToast.error("접근 권한.", "권한이 없어 홈으로 이동합니다.",  <IconShieldLock size={16} />);
        return <Navigate to="/home" state={{ from: location }} replace />;

    }
    // 모든 조건을 만족하면 children 렌더링
    return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;