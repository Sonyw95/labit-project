import {useNavigate} from "react-router-dom";
import {useNavigationClick, useNavigationState} from "@/hooks/api/useNavigation.js";
import {memo} from "react";
import {Collapse, Group, Stack, UnstyledButton} from "@mantine/core";
import {IconChevronDown, IconChevronRight} from "@tabler/icons-react";
import {Icons} from "@/utils/Icons.jsx";

const NavigationItem = memo(({ node, level = 0 }) => {
    const navigate = useNavigate();
    const { handleNavigationClick } = useNavigationClick();
    const { expandedNodes, activeNodeId } = useNavigationState();

    const isExpanded = expandedNodes.has(node.navId);
    const isActive = activeNodeId === node.navId;
    const hasChildren = node.hasChildren && node.children && node.children.length > 0;

    const paddingLeft = level * 20 + 16;

    const handleClick = () => {
        handleNavigationClick(node, navigate);
    };

    const buttonStyles = {
        width: '100%',
        padding: '8px 16px',
        paddingLeft: `${paddingLeft}px`,
        minHeight: '40px',
        borderRadius: 0,
        backgroundColor: isActive ? '#e7f5ff' : 'transparent',
        borderLeft: isActive ? '3px solid #228be6' : '3px solid transparent',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: isActive ? '#e7f5ff' : '#f8f9fa',
        },
    };

    const textStyles = {
        color: isActive ? '#228be6' : '#495057',
        fontWeight: isActive ? 600 : 400,
        fontSize: '14px',
    };

    return (
        <div>
            <UnstyledButton
                onClick={handleClick}
                styles={{
                    root: buttonStyles
                }}
            >
                <Group spacing="xs" noWrap>
                    {hasChildren && (
                        isExpanded ? (
                            <IconChevronDown size={16} color="#868e96" />
                        ) : (
                            <IconChevronRight size={16} color="#868e96" />
                        )
                    )}

                    {!hasChildren && <div style={{ width: 16 }} />}

                    <Icons icon={node.navIcon} size={16} />

                    <Text style={textStyles} truncate>
                        {node.navName}
                    </Text>
                </Group>
            </UnstyledButton>

            {hasChildren && (
                <Collapse in={isExpanded}>
                    <Stack spacing={0}>
                        {node.children.map((child) => (
                            <NavigationItem
                                key={child.navId}
                                node={child}
                                level={level + 1}
                            />
                        ))}
                    </Stack>
                </Collapse>
            )}
        </div>
    );
});
export default NavigationItem;