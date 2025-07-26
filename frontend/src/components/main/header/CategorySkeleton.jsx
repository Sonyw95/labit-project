import React, { memo } from "react";
import { Group, Skeleton } from "@mantine/core";

const CategorySkeleton = memo(({ velogColors }) => {
    return (
        <Group gap="xs">
            {[1, 2, 3].map((index) => (
                <Skeleton
                    key={index}
                    height={32}
                    width={80}
                    radius="md"
                    style={{ backgroundColor: velogColors.hover }}
                />
            ))}
        </Group>
    );
});

CategorySkeleton.displayName = 'CategorySkeleton';

export default CategorySkeleton;