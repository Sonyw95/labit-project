import {memo} from "react";
import {Alert, Box, Button, LoadingOverlay, Stack, Text} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import NavigationItem from "./NavigationItem.jsx";
import {useNavigation} from "../hooks/api/useNavigation.js";
const NavigationTree = memo(() => {
    const {
        navigationTree,
        isLoading,
        error,
        actions
    } = useNavigation();

    // 데이터가 로딩 중이거나 없는 경우 로딩 표시
    if (isLoading && navigationTree.length === 0) {
        return (
            <Box style={{ position: 'relative', minHeight: '200px' }}>
                <LoadingOverlay overlayBlur={2} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="오류 발생"
                color="red"
                variant="light"
                styles={{
                    root: { margin: '1rem' }
                }}
            >
                {error.message || error}
                <br />
                <Button
                    onClick={actions.refetch}
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #fa5252',
                        color: '#fa5252',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    다시 시도
                </Button>
            </Alert>
        );
    }

    // 네비게이션 데이터가 없는 경우
    if (!navigationTree || navigationTree.length === 0) {
        return (
            <Box style={{ padding: '1rem', textAlign: 'center', color: '#868e96' }}>
                네비게이션 데이터가 없습니다.
            </Box>
        );
    }

    return (
        <Box style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoading} overlayBlur={2} />
            <Stack spacing={0}>
                {navigationTree.map((node) => (
                    <NavigationItem
                        key={node.navId}
                        node={node}
                        level={0}
                    />
                ))}
            </Stack>
        </Box>
    );
});
export default NavigationTree;