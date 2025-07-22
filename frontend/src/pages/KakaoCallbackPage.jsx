import {memo, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useKakaoLogin} from "../hooks/api/useApi.js";
import {Alert, Button, Center, Loader, Stack, Text} from "@mantine/core";
import {IconAlertTriangle, IconHome} from "@tabler/icons-react";

const KakaoCallbackPage = memo(() => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);

    const kakaoLoginMutation = useKakaoLogin();
    const callBackKakao = async () => {
        try {
            // URL에서 파라미터 추출
            const code = searchParams.get('code');
            const error = searchParams.get('error');
            const errorDescription = searchParams.get('error_description');
            const state = searchParams.get('state');

            console.log('카카오 콜백 처리 시작:', {
                code: code ? 'exists' : 'missing',
                error,
                errorDescription,
                state
            });

            // 에러가 있는 경우
            if (error) {
                let errorMessage = '카카오 로그인 중 오류가 발생했습니다.';

                switch (error) {
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
                return;
            }

            // 인증 코드가 없는 경우
            if (!code) {
                setError('인증 코드를 받지 못했습니다.');
                setIsProcessing(false);
                return;
            }

            // 카카오 로그인 처리
            await kakaoLoginMutation.mutateAsync(code);

            // 로그인 성공 시 홈으로 이동
            console.log('카카오 로그인 성공, 홈으로 이동');
            navigate('/home', { replace: true });

        } catch (err) {
            console.error('카카오 콜백 처리 실패:', err);
            setError(err.message || '로그인 처리 중 오류가 발생했습니다.');
            setIsProcessing(false);
        }
    }
    callBackKakao()
    console.log(searchParams)

    // useEffect(() => {
    //     const processKakaoCallback = async () => {
    //         try {
    //             // URL에서 파라미터 추출
    //             const code = searchParams.get('code');
    //             const error = searchParams.get('error');
    //             const errorDescription = searchParams.get('error_description');
    //             const state = searchParams.get('state');
    //
    //             console.log('카카오 콜백 처리 시작:', {
    //                 code: code ? 'exists' : 'missing',
    //                 error,
    //                 errorDescription,
    //                 state
    //             });
    //
    //             // 에러가 있는 경우
    //             if (error) {
    //                 let errorMessage = '카카오 로그인 중 오류가 발생했습니다.';
    //
    //                 switch (error) {
    //                     case 'access_denied':
    //                         errorMessage = '사용자가 로그인을 취소했습니다.';
    //                         break;
    //                     case 'invalid_request':
    //                         errorMessage = '잘못된 요청입니다.';
    //                         break;
    //                     case 'server_error':
    //                         errorMessage = '카카오 서버 오류가 발생했습니다.';
    //                         break;
    //                     default:
    //                         errorMessage = errorDescription || errorMessage;
    //                 }
    //
    //                 setError(errorMessage);
    //                 setIsProcessing(false);
    //                 return;
    //             }
    //
    //             // 인증 코드가 없는 경우
    //             if (!code) {
    //                 setError('인증 코드를 받지 못했습니다.');
    //                 setIsProcessing(false);
    //                 return;
    //             }
    //
    //             // 카카오 로그인 처리
    //             await kakaoLoginMutation.mutateAsync(code);
    //
    //             // 로그인 성공 시 홈으로 이동
    //             console.log('카카오 로그인 성공, 홈으로 이동');
    //             navigate('/home', { replace: true });
    //
    //         } catch (err) {
    //             console.error('카카오 콜백 처리 실패:', err);
    //             setError(err.message || '로그인 처리 중 오류가 발생했습니다.');
    //             setIsProcessing(false);
    //         }
    //     };
    //
    //     processKakaoCallback();
    // }, [searchParams, kakaoLoginMutation, navigate]);

    // 로딩 중 화면
    if (isProcessing) {
        return (
            <Center h="100vh">
                <Stack align="center" spacing="md">
                    <Loader size="xl" />
                    <Text size="lg">카카오 로그인 처리 중...</Text>
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
                        onClick={() => navigate('/home')}
                        size="md"
                    >
                        홈으로 가기
                    </Button>
                </Stack>
            </Center>
        );
    }

    return null;
})

export default KakaoCallbackPage;