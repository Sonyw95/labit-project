import {apiClient} from "../lib/apiClient.js";

export class KakaoAuth {
    // 카카오 로그인 URL 가져오기
    static async getKakaoLoginUrl() {
        const response = await apiClient.get('/auth/kakao/url');
        return response.data;
    }

    // 카카오 인증 코드로 로그인
    static async loginWithKakaoCode(code) {
        const response = await apiClient.post(`/auth/kakao/login?code=${code}`);
        return response.data;
    }

    // 카카오 로그인 팝업 열기
    static openKakaoLoginPopup() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const kakaoLoginUrl = await this.getKakaoLoginUrl();

                const popup = window.open(
                    kakaoLoginUrl,
                    'kakaoLogin',
                    `width=500,height=700,scrollbars=yes,resizable=yes,left=${ 
                    window.screen.width / 2 - 250  },top=${ 
                    window.screen.height / 2 - 350}`
                );

                if (!popup) {
                    reject(new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'));
                    return;
                }

                // 팝업 모니터링
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        reject(new Error('로그인이 취소되었습니다.'));
                    }
                }, 1000);

                // 메시지 리스너
                const messageListener = (event) => {
                    // 보안을 위해 origin 체크
                    if (event.origin !== window.location.origin) {return;}

                    if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        resolve(event.data.code);
                    } else if (event.data.type === 'KAKAO_LOGIN_ERROR') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        reject(new Error(event.data.error || '카카오 로그인 중 오류가 발생했습니다.'));
                    }
                };

                window.addEventListener('message', messageListener);

                // 타임아웃 설정 (5분)
                setTimeout(() => {
                    if (!popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        reject(new Error('로그인 시간이 초과되었습니다.'));
                    }
                }, 300000); // 5분

            } catch (error) {
                reject(error);
            }
        });
    }

    // 로그아웃
    static async logout() {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    }

    // 현재 사용자 정보 조회
    static async getCurrentUser() {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }
}