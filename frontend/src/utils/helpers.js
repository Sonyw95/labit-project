// BackgroundBlur 유틸리티 함수

import {alpha} from "@mantine/core";

export function BackgroundBlur(props) {
    const blur = 6;
    const alphaPoint = props?.alpha || 0.3;
    const color = props.color;
    return{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, alphaPoint),
    }
}
// 태그 색상 매핑 함수
export const getTagColor = (color) => {
    const colorMap = {
        blue: '#3b82f6',
        green: '#10b981',
        orange: '#f59e0b',
        indigo: '#6366f1',
        yellow: '#eab308'
    };
    return colorMap[color] || '#6b7280';
};

// 기술 스택 설정 함수
export const getTechConfig = (techName, isActive = false) => {
    const configs = {
        Java: {
            icon: '☕',
            color: isActive ? '#f59e0b' : '#6b7280'
        },
        Spring: {
            icon: '🍃',
            color: isActive ? '#10b981' : '#6b7280'
        },
        React: {
            icon: '⚛️',
            color: isActive ? '#3b82f6' : '#6b7280'
        }
    };
    return configs[techName] || { icon: '💻', color: '#6b7280' };
};