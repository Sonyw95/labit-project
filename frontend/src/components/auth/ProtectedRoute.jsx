import { Navigate, useLocation } from 'react-router-dom';
import {Text, Loader, Center} from '@mantine/core';
import React, {memo} from "react";
import useAuthStore from "../../stores/authStore.js";
import {IconShieldLock} from "@tabler/icons-react";
import {showToast} from "../advanced/Toast.jsx";

const ProtectedRoute = memo(({
                                 children
                                 , requiredRole = false
                             })  => {
    const location = useLocation();
    const {
        isAuthenticated,
        isAdmin,
        isLoading
    } = useAuthStore();

    // 로딩 중인 경우
    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader size="lg" />
                <Text ml="md">인증 정보를 확인하는 중...</Text>
            </Center>
        );
    }

    // 인증되지 않은 경우
    if (!isAuthenticated) {
        showToast.error(`인증되지 않은 사용자`, "홈으로 이동합니다.", <IconShieldLock size={16} />);
        return <Navigate to="/home" state={{ from: location }} replace />;
    }

    if( requiredRole && !isAdmin  ){
        showToast.error("접근 권한.", "권한이 없어 홈으로 이동합니다.",  <IconShieldLock size={16} />);
        return <Navigate to="/home" state={{ from: location }} replace />;
    }


    // 역할 확인이 필요한 경우
    // if (requiredRole) {
    //     // 관리자 권한이 필요한 경우
    //     if (requiredRole === 'ADMIN' && !isAdmin) {
    //         return (
    //             <Container size="sm" py="xl">
    //                 <Alert
    //                     icon={<IconShieldLock size={16} />}
    //                     color="red"
    //                     variant="light"
    //                     title="접근 권한이 없습니다"
    //                 >
    //                     <Text mb="md">
    //                         관리자 페이지에 접근하려면 관리자 권한이 필요합니다.
    //                         <br />
    //                         현재 권한: {user?.role || '권한 없음'}
    //                     </Text>
    //                     <Group>
    //                         <Button
    //                             component="a"
    //                             href="/home"
    //                             leftSection={<IconHome size={16} />}
    //                             variant="subtle"
    //                             aria-label="홈으로 가기"
    //                         >
    //                             홈으로 돌아가기
    //                         </Button>
    //                     </Group>
    //                 </Alert>
    //             </Container>
    //         );
    //     }
    //
    //     // 특정 역할이 필요한 경우 (확장 가능)
    //     if (typeof requiredRole === 'string' && user?.role !== requiredRole) {
    //         return (
    //             <Container size="sm" py="xl">
    //                 <Alert
    //                     icon={<IconShieldLock size={16} />}
    //                     color="orange"
    //                     variant="light"
    //                     title="권한이 부족합니다"
    //                 >
    //                     <Text mb="md">
    //                         이 페이지에 접근하려면 {requiredRole} 권한이 필요합니다.
    //                         <br />
    //                         현재 권한: {user?.role || '권한 없음'}
    //                     </Text>
    //                     <Group>
    //                         <Button
    //                             component="a"
    //                             href="/home"
    //                             leftSection={<IconHome size={16} />}
    //                             variant="subtle"
    //                             aria-label="홈으로 가기"
    //                         >
    //                             홈으로 돌아가기
    //                         </Button>
    //                     </Group>
    //                 </Alert>
    //             </Container>
    //         );
    //     }
    //
    //     // 배열로 여러 역할을 허용하는 경우
    //     if (Array.isArray(requiredRole) && !requiredRole.includes(user?.role)) {
    //         return (
    //             <Container size="sm" py="xl">
    //                 <Alert
    //                     icon={<IconShieldLock size={16} />}
    //                     color="orange"
    //                     variant="light"
    //                     title="권한이 부족합니다"
    //                 >
    //                     <Text mb="md">
    //                         이 페이지에 접근하려면 다음 중 하나의 권한이 필요합니다: {requiredRole.join(', ')}
    //                         <br />
    //                         현재 권한: {user?.role || '권한 없음'}
    //                     </Text>
    //                     <Group>
    //                         <Button
    //                             component="a"
    //                             href="/home"
    //                             leftSection={<IconHome size={16} />}
    //                             variant="subtle"
    //                             aria-label="홈으로 가기"
    //                         >
    //                             홈으로 돌아가기
    //                         </Button>
    //                     </Group>
    //                 </Alert>
    //             </Container>
    //         );
    //     }
    // }

    // 모든 조건을 만족하면 children 렌더링
    return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;