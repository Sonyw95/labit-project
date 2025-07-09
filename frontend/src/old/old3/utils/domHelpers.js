// ========================================
// utils/domHelpers.js - DOM 관련 유틸리티
// ========================================

/**
 * 요소가 뷰포트에 보이는지 확인
 * @param {Element} element - DOM 요소
 * @param {number} threshold - 임계값 (0-1)
 * @returns {boolean} 보이는 여부
 */
export const isElementInViewport = (element, threshold = 0) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= (windowHeight * threshold));
    const horInView = (rect.left <= windowWidth * (1 - threshold)) && ((rect.left + rect.width) >= (windowWidth * threshold));

    return vertInView && horInView;
};

/**
 * 부드러운 스크롤
 * @param {number} targetPosition - 목표 위치
 * @param {number} duration - 지속 시간 (ms)
 */
export const smoothScrollTo = (targetPosition, duration = 1000) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
        if (startTime === null) {startTime = currentTime;}
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {requestAnimationFrame(animation);}
    };

    const easeInOutQuad = (t, b, c, d) => {
        // eslint-disable-next-line no-param-reassign
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t + b;
        }
        // eslint-disable-next-line no-param-reassign
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
};

/**
 * 요소를 화면 중앙으로 스크롤
 * @param {Element} element - DOM 요소
 * @param {number} duration - 지속 시간 (ms)
 */
export const scrollToElement = (element, duration = 1000) => {
    const elementTop = element.offsetTop;
    const elementHeight = element.offsetHeight;
    const windowHeight = window.innerHeight;
    const offset = elementTop - (windowHeight / 2) + (elementHeight / 2);

    smoothScrollTo(offset, duration);
};

/**
 * 클립보드에 텍스트 복사
 * @param {string} text - 복사할 텍스트
 * @returns {Promise<boolean>} 성공 여부
 */
export const copyToClipboard = async (text) => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
            // 폴백 방법
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;

    } catch (err) {
        console.error('Failed to copy: ', err);
        return false;
    }
};