import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { Button } from '@mantine/core';
import { IconBrandKakao } from "@/utils/helpers.jsx";
import { useKakaoAuthPath } from "@/hooks/api/useApi.js";

const KakaoLoginButton = memo(({ loading }) => {
    const { data } = useKakaoAuthPath();
    const [isLoading, setIsLoading] = useState(false);

    // 카카오 버튼 스타일 메모이제이션
    const kakaoButtonStyles = useMemo(() => ({
        root: {
            backgroundColor: '#FEE500',
            color: '#3C1E1E',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.2s ease',
        }
    }), []);

    // 호버 색상 메모이제이션
    const hoverColor = useMemo(() => '#FDD835', []);

    // 카카오 로그인 핸들러 메모이제이션
    const handleKakaoLogin = useCallback(() => {
        // 중복 클릭 방지
        if (isLoading || loading) {
            console.log('이미 로그인 진행 중, 중복 클릭 방지');
            return;
        }

        setIsLoading(true);

        // 상태 파라미터 생성
        const state = Math.random().toString(36).substring(2, 15);
        const authUrl = `${data}&state=${state}`;

        try {
            window.location.href = authUrl;
        } catch (error) {
            console.error('카카오 로그인 오류:', error);
            setIsLoading(false);
        }
    }, [isLoading, loading, data]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        let timeoutId;

        if (isLoading) {
            timeoutId = setTimeout(() => {
                setIsLoading(false);
            }, 5000);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isLoading]);

    // 호버 이벤트 핸들러
    const handleMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = hoverColor;
    }, [hoverColor]);

    const handleMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = '#FEE500';
    }, []);

    return (
        <Button
            variant="filled"
            leftSection={<IconBrandKakao size={20} aria-hidden="true" />}
            onClick={handleKakaoLogin}
            loading={isLoading || loading}
            disabled={!data || isLoading || loading}
            fullWidth
            size="lg"
            styles={kakaoButtonStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="카카오 계정으로 로그인하기"
            data-testid="kakao-login-button"
        >
            카카오로 로그인
        </Button>
    );
});

KakaoLoginButton.displayName = 'KakaoLoginButton';

export default KakaoLoginButton;