import {useNavigationState, useNavigationTree} from "@/hooks/api/useNavigation.js";
import {memo} from "react";
import {Alert, Box, Button, LoadingOverlay, Stack} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import NavigationItem from "@/components/layout/NavigationItem.jsx";

const NavigationTree = memo(() => {
    const { isLoading, error, refetch } = useNavigationTree();

    const { navigationTree, isLoading: storeLoading, error: storeError } = useNavigationState();
    const loading = isLoading || storeLoading;
    const errorMessage = error?.message || storeError;

    if (errorMessage) {
        return (
            <Alert
                icon={<IconAlertCircle size={20} />}
                title="오류 발생"
                color="red"
                variant="light"
                styles={{
                    root: { margin: '1rem' }
                }}
            >
                {errorMessage}
                <br />
                <Button
                    onClick={() => refetch()}
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

    return (
        <Box style={{ position: 'relative', minHeight: '200px' }}>
            {/*<LoadingOverlay visible={loading} overlayBlur={2} />*/}
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