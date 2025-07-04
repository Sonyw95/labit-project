import {useAuthStore} from "@/store/authStore.js";
import {Alert} from "@mantine/core";
import {IconLock, IconLogin} from "@tabler/icons-react";

export const ProtectedRoute = ({children, requiredRoles = [] }) =>{
    const { isAuthenticated, user } = useAuthStore();
    if( ! isAuthenticated ){
        return (
            <Alert
                icon={<IconLogin size={20}/>}
                title='로그인 필요'
                style={{ textAlign: 'center' }}
            >
                로그인 필요.
            </Alert>
        )
    }
    if( requiredRoles.length >  0 ){
        // eslint-disable-next-line array-callback-return
        const hasRequiredRole = requiredRoles.some( role => {
            user?.roles?.includes(role);
        });
        if( !hasRequiredRole ){
            return (
                <Alert
                    icon={<IconLock size="1rem" />}
                    title="접근 권한 없음"
                    color="red"
                    style={{ textAlign: 'center' }}
                >
                    이 페이지에 접근할 권한이 없습니다.
                </Alert>
            )
        }
    }
    return children;
}