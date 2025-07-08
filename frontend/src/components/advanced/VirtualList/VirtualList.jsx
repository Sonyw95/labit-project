
// ========================================
// components/advanced/VirtualList/VirtualList.jsx - 가상화 리스트 (성능 최적화)
// ========================================
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box } from '@mantine/core';
import { useEventListener } from '../../hooks';

const VirtualList = ({
                         items = [],
                         itemHeight = 60,
                         containerHeight = 400,
                         overscan = 5,
                         renderItem,
                         getItemId = (item, index) => index,
                         ...props
                     }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);

    // 스크롤 핸들러 (스로틀링 적용)
    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            setScrollTop(containerRef.current.scrollTop);
        }
    }, []);

    useEventListener('scroll', handleScroll, containerRef);

    // 렌더링할 아이템 범위 계산
    const visibleRange = useMemo(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const endIndex = Math.min(
            items.length - 1,
            Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
        );

        return { startIndex, endIndex };
    }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

    // 렌더링할 아이템들
    const visibleItems = useMemo(() => {
        const { startIndex, endIndex } = visibleRange;
        const itemsToRender = [];

        for (let i = startIndex; i <= endIndex; i++) {
            if (items[i]) {
                itemsToRender.push({
                    index: i,
                    item: items[i],
                    key: getItemId(items[i], i),
                    offsetY: i * itemHeight,
                });
            }
        }

        return itemsToRender;
    }, [visibleRange, items, itemHeight, getItemId]);

    const totalHeight = items.length * itemHeight;

    return (
        <Box
            ref={containerRef}
            style={{
                height: containerHeight,
                overflow: 'auto',
                position: 'relative',
            }}
            {...props}
        >
            {/* 전체 높이를 위한 spacer */}
            <Box style={{ height: totalHeight, position: 'relative' }}>
                {/* 보이는 아이템들만 렌더링 */}
                {visibleItems.map(({ key, index, item, offsetY }) => (
                    <Box
                        key={key}
                        style={{
                            position: 'absolute',
                            top: offsetY,
                            left: 0,
                            right: 0,
                            height: itemHeight,
                        }}
                    >
                        {renderItem({ item, index })}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default VirtualList;