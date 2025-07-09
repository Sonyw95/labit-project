// VirtualizedList 컴포넌트
import { FixedSizeList as List } from 'react-window';
import {memo, useCallback} from "react";
import {Box} from "@mantine/core";

const VirtualizedList = memo(({
                                  items,
                                  itemHeight = 60,
                                  height = 400,
                                  renderItem,
                                  overscan = 5,
                                  ...props
                              }) => {
    const Row = useCallback(({ index, style }) => {
        const item = items[index];
        return (
            <Box style={style}>
                {renderItem(item, index)}
            </Box>
        );
    }, [items, renderItem]);

    if (!items || items.length === 0) {
        return (
            <Box h={height} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text c="dimmed">표시할 항목이 없습니다.</Text>
            </Box>
        );
    }

    return (
        <List
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            overscanCount={overscan}
            {...props}
        >
            {Row}
        </List>
    );
});

VirtualizedList.displayName = 'VirtualizedList';
export default VirtualizedList;