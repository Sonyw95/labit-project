import FolderItem from "@/components/admin/asset/FolderItem.jsx";
import {memo, useCallback, useMemo} from "react";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {Box, Group, rem, Text} from "@mantine/core";
import {IconFolder} from "@tabler/icons-react";

const FolderTree = memo(({
                             folders,
                             expandedFolders,
                             selectedFolder,
                             onToggleExpand,
                             onFolderSelect,
                             onEdit,
                             onDelete,
                         }) => {
    const { velogColors } = useTheme();

    const rootFolderStyle = useMemo(() => ({
        cursor: 'pointer',
        backgroundColor: !selectedFolder ? velogColors.selectedBg : velogColors.background,
        border: `1px solid ${velogColors.border}`,
        borderRadius: rem(8),
        transition: 'all 0.2s ease',
    }), [selectedFolder, velogColors]);

    const handleRootSelect = useCallback(() => {
        if (onFolderSelect) {
            onFolderSelect(null);
        }
    }, [onFolderSelect]);

    const handleRootMouseEnter = useCallback((e) => {
        if (selectedFolder) {
            e.currentTarget.style.backgroundColor = velogColors.hover;
        }
    }, [selectedFolder, velogColors.hover]);

    const handleRootMouseLeave = useCallback((e) => {
        if (selectedFolder) {
            e.currentTarget.style.backgroundColor = velogColors.background;
        }
    }, [selectedFolder, velogColors.background]);

    return (
        <Box role="tree" aria-label="폴더 트리">
            <Box
                p="md"
                mb="sm"
                style={rootFolderStyle}
                onClick={handleRootSelect}
                onMouseEnter={handleRootMouseEnter}
                onMouseLeave={handleRootMouseLeave}
                role="treeitem"
                aria-selected={!selectedFolder}
                aria-label="루트 폴더"
                tabIndex={0}
            >
                <Group gap="sm">
                    <IconFolder size={18} style={{ color: velogColors.warning }} aria-hidden="true" />
                    <Text fw={500} style={{ color: velogColors.text }}>
                        루트 폴더
                    </Text>
                </Group>
            </Box>

            {folders.map(folder => (
                <FolderItem
                    key={folder.id}
                    folder={folder}
                    depth={0}
                    expandedFolders={expandedFolders}
                    selectedFolder={selectedFolder}
                    onToggleExpand={onToggleExpand}
                    onFolderSelect={onFolderSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </Box>
    );
});

FolderTree.displayName = 'FolderTree';

export default FolderTree;