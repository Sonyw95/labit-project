import {memo} from "react";
import {Group, Skeleton, Stack} from "@mantine/core";


const NavigationSkeletonItem = memo(() => (
    <Group gap='sm' p='xs'>
        <Skeleton height={20} width={20} />
        <Skeleton height={16} width={120} />
    </Group>
))

const NavigationSkeleton = memo(( { count = 5 }) => {
    return (
        <Stack gap='xs'>
            { Array.from( {length: count }, (_, index) => (
                <NavigationSkeletonItem key={index}/>
            ))}
        </Stack>
    )
})
export default NavigationSkeleton;