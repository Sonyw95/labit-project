import {useNavigate, useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import useAuthStore from "../stores/authStore.js";
import {authService} from "../api/service.js";
import {showToast} from "../components/advanced/Toast.jsx";
import {Alert, Button, Center, Loader, Stack, Text} from "@mantine/core";
import {IconAlertTriangle, IconHome} from "@tabler/icons-react";

function KakaoCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const { login, setLoading } = useAuthStore();

    // 처리 완료 여부를 추적하여 중복 실행 방지
    const hasProcessed = useRef(false);

    // 카카오 콜백 처리 함수 (useCallback으로 메모이제이션)
    const processKakaoCallback = useCallback(async () => {
        // 이미 처리된 경우 중복 실행 방지
        if (hasProcessed.current) {
            console.log('이미 처리된 콜백, 중복 실행 방지');
            return;
        }

        try {
            hasProcessed.current = true;
            setLoading(true);

            // URL에서 파라미터 추출
            const code = searchParams.get('code');
            const errorParam = searchParams.get('error');
            const errorDescription = searchParams.get('error_description');

            console.log('카카오 콜백 처리 시작');

            // 에러가 있는 경우
            if (errorParam) {
                let errorMessage = '카카오 로그인 중 오류가 발생했습니다.';

                switch (errorParam) {
                    case 'access_denied':
                        errorMessage = '사용자가 로그인을 취소했습니다.';
                        break;
                    case 'invalid_request':
                        errorMessage = '잘못된 요청입니다.';
                        break;
                    case 'server_error':
                        errorMessage = '카카오 서버 오류가 발생했습니다.';
                        break;
                    default:
                        errorMessage = errorDescription || errorMessage;
                }

                setError(errorMessage);
                setIsProcessing(false);
                setLoading(false);
                return;
            }

            // 인증 코드가 없는 경우
            if (!code) {
                setError('인증 코드를 받지 못했습니다.');
                setIsProcessing(false);
                setLoading(false);
                return;
            }

            console.log('카카오 로그인 API 호출 시작');

            // 카카오 로그인 API 호출
            const {data} = await authService.kakaoLogin(code);

            console.log('카카오 로그인 API 성공', {data});

            if (!data?.accessToken) {
                throw new Error('액세스 토큰을 받지 못했습니다.');
            }

            // 로그인 상태 저장 (refreshToken도 함께 저장)
            const loginSuccess = login(
                data.accessToken,
                data.refreshToken || null
            );

            if (!loginSuccess) {
                throw new Error('로그인 정보 저장에 실패했습니다.');
            }

            showToast.success('로그인 성공', '카카오 로그인이 완료되었습니다.');

            // 로그인 성공 시 홈으로 이동
            console.log('카카오 로그인 성공, 홈으로 이동');
            setTimeout(() => {
                navigate('/home', { replace: false });
            }, 1000);

        } catch (err) {
            console.error('카카오 콜백 처리 실패:', err);

            const errorMessage = err.response?.data?.message ||
                err.message ||
                '로그인 처리 중 오류가 발생했습니다.';

            setError(errorMessage);
            setIsProcessing(false);

            // 에러 알림
            showToast.error('로그인 실패', errorMessage);
        } finally {
            setLoading(false);
        }
    }, [searchParams, login, navigate, setLoading]);

    // 컴포넌트 마운트 시 한 번만 실행
    useEffect(() => {
        processKakaoCallback();
    }, []); // 빈 의존성 배열로 한 번만 실행

    // 로딩 중 화면
    if (isProcessing) {
        return (
            <Center h="100vh">
                <Stack align="center" spacing="md">
                    <Loader size="xl" />
                    <Text size="lg" fw={500}>카카오 로그인 처리 중...</Text>
                    <Text size="sm" c="dimmed">
                        잠시만 기다려주세요.
                    </Text>
                </Stack>
            </Center>
        );
    }

    // 에러 화면
    if (error) {
        return (
            <Center h="100vh">
                <Stack align="center" spacing="lg" maw={400}>
                    <Alert
                        variant="light"
                        color="red"
                        title="로그인 실패"
                        icon={<IconAlertTriangle size={16} />}
                    >
                        {error}
                    </Alert>

                    <Button
                        leftSection={<IconHome size={16} />}
                        onClick={() => navigate('/home', { replace: true })}
                        size="md"
                    >
                        홈으로 가기
                    </Button>
                </Stack>
            </Center>
        );
    }

    return null;
}

export default KakaoCallbackPage;