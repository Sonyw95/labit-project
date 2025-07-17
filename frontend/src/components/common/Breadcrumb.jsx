import {useLocation, useNavigate} from "react-router-dom";
import {useNavigationPath} from "@/hooks/api/useNavigation.js";
import {Anchor, Breadcrumbs, Group, Skeleton} from "@mantine/core";
import {memo} from "react";
import {IconChevronRight, IconHome} from "@tabler/icons-react";
import {Icons} from "@/utils/Icons.jsx";

const Breadcrumb = memo(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const { path, isLoading } = useNavigationPath(location.pathname);

    if (isLoading) {
        return (
            <Group spacing="xs" style={{ padding: '12px 16px' }}>
                <Skeleton height={16} width={20} />
                <Skeleton height={16} width={8} />
                <Skeleton height={16} width={80} />
                <Skeleton height={16} width={8} />
                <Skeleton height={16} width={120} />
            </Group>
        );
    }

    if (!path || path.length === 0) {
        return (
            <Group spacing="xs" style={{ padding: '12px 16px' }}>
                <IconHome size={16} color="#868e96" />
                <Text size="sm" color="dimmed">홈</Text>
            </Group>
        );
    }

    const breadcrumbItems = path.map((item, index) => {
        const isLast = index === path.length - 1;

        if (isLast) {
            return (
                <Group key={item.navId} spacing="xs">
                    <Icons icon={item.navIcon} size={14} color="#495057" />
                    <Text size="sm" weight={500} color="dark">
                        {item.navName}
                    </Text>
                </Group>
            );
        }

        return (
            <Anchor
                key={item.navId}
                onClick={() => item.navUrl && navigate(item.navUrl)}
                style={{
                    textDecoration: 'none',
                    cursor: item.navUrl ? 'pointer' : 'default',
                }}
            >
                <Group spacing="xs">
                    <Icons icon={item.navIcon} size={14} color="#868e96" />
                    <Text size="sm" color="dimmed">
                        {item.navName}
                    </Text>
                </Group>
            </Anchor>
        );
    });

    return (
        <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa'
        }}>
            <Breadcrumbs
                separator={<IconChevronRight size={12} color="#adb5bd" />}
                styles={{
                    root: {
                        fontSize: '14px'
                    },
                    breadcrumb: {
                        display: 'flex',
                        alignItems: 'center'
                    }
                }}
            >
                <Anchor onClick={() => navigate('/')} style={{ textDecoration: 'none' }}>
                    <Group spacing="xs">
                        <IconHome size={14} color="#868e96" />
                        <Text size="sm" color="dimmed">홈</Text>
                    </Group>
                </Anchor>
                {breadcrumbItems}
            </Breadcrumbs>
        </div>
    );
});

export default Breadcrumb;