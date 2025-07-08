// ========================================
// components/advanced/SearchBar/SearchBar.jsx - 2025 트렌드 검색바
// ========================================
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    TextInput,
    Box,
    Paper,
    Group,
    Text,
    ActionIcon,
    Loader,
    Kbd,
    Stack,
    Highlight,
    Avatar,
    Badge,
    useMantineColorScheme
} from '@mantine/core';
import {
    IconSearch,
    IconX,
    IconHistory,
    IconTrendingUp,
    IconFilter,
    IconCommand
} from '@tabler/icons-react';
import { useDebounce, useClickOutside, useEventListener } from '../../hooks';

const SearchBar = ({
                       placeholder = '검색어를 입력하세요...',
                       onSearch,
                       onResultClick,
                       suggestions = [],
                       recentSearches = [],
                       popularSearches = [],
                       isLoading = false,
                       showFilters = false,
                       filters = [],
                       activeFilters = [],
                       onFilterChange,
                       size = 'md',
                       radius = 'xl',
                       variant = 'filled',
                       ...props
                   }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const clickOutsideRef = useClickOutside(() => setIsOpen(false));

    const debouncedQuery = useDebounce(query, 300);

    // 2025 트렌드: Bento Box 스타일 적용
    const getSearchBarStyles = () => ({
        background: dark
            ? 'linear-gradient(135deg, rgba(22, 27, 34, 0.8) 0%, rgba(13, 17, 23, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
        borderRadius: radius === 'xl' ? '20px' : radius === 'lg' ? '16px' : '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isOpen
            ? (dark ? '0 20px 64px rgba(0, 0, 0, 0.4)' : '0 20px 64px rgba(0, 0, 0, 0.1)')
            : (dark ? '0 4px 16px rgba(0, 0, 0, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.05)'),
    });

    const getResultsStyles = () => ({
        background: dark
            ? 'rgba(22, 27, 34, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
        borderRadius: '16px',
        boxShadow: dark
            ? '0 20px 64px rgba(0, 0, 0, 0.4)'
            : '0 20px 64px rgba(0, 0, 0, 0.1)',
        marginTop: '8px',
        maxHeight: '400px',
        overflowY: 'auto',
    });

    // 검색 실행
    useEffect(() => {
        if (debouncedQuery.trim()) {
            onSearch?.(debouncedQuery);
            setIsOpen(true);
        }
    }, [debouncedQuery, onSearch]);

    // 키보드 이벤트 처리
    const handleKeyDown = useCallback((event) => {
        if (!isOpen) return;

        const totalItems = suggestions.length + recentSearches.length + popularSearches.length;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                event.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
                break;
            case 'Enter':
                event.preventDefault();
                if (selectedIndex >= 0) {
                    const allItems = [...suggestions, ...recentSearches, ...popularSearches];
                    const selectedItem = allItems[selectedIndex];
                    handleResultClick(selectedItem);
                } else {
                    handleSearch();
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    }, [isOpen, selectedIndex, suggestions, recentSearches, popularSearches]);

    useEventListener('keydown', handleKeyDown);

    // CMD/Ctrl + K로 포커스
    useEventListener('keydown', (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            inputRef.current?.focus();
            setIsOpen(true);
        }
    });

    const handleSearch = () => {
        if (query.trim()) {
            onSearch?.(query);
            setIsOpen(false);
        }
    };

    const handleResultClick = (item) => {
        setQuery(item.title || item.text || item);
        setIsOpen(false);
        onResultClick?.(item);
    };

    const handleClear = () => {
        setQuery('');
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const renderSearchResult = (item, index, type = 'suggestion') => {
        const isSelected = index === selectedIndex;

        return (
            <Box
                key={`${type}-${index}`}
                onClick={() => handleResultClick(item)}
                style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    margin: '4px 8px',
                    background: isSelected
                        ? (dark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)')
                        : 'transparent',
                    border: isSelected
                        ? `1px solid ${dark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`
                        : '1px solid transparent',
                    transition: 'all 0.2s ease',
                }}
            >
                <Group gap="md">
                    {item.icon && (
                        <Box style={{ color: dark ? '#8b949e' : '#64748b' }}>
                            {item.icon}
                        </Box>
                    )}

                    {item.avatar && (
                        <Avatar src={item.avatar} size="sm" radius="xl" />
                    )}

                    <Box style={{ flex: 1 }}>
                        <Text
                            size="sm"
                            fw={500}
                            style={{ color: dark ? '#f0f6fc' : '#1e293b' }}
                        >
                            <Highlight highlight={query} highlightStyles={{
                                background: dark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)',
                                color: 'inherit'
                            }}>
                                {item.title || item.text || item}
                            </Highlight>
                        </Text>

                        {item.description && (
                            <Text
                                size="xs"
                                c="dimmed"
                                lineClamp={1}
                                mt={2}
                            >
                                {item.description}
                            </Text>
                        )}
                    </Box>

                    {item.badge && (
                        <Badge size="xs" variant="light">
                            {item.badge}
                        </Badge>
                    )}

                    {type === 'recent' && (
                        <IconHistory size={16} style={{ color: dark ? '#8b949e' : '#64748b' }} />
                    )}

                    {type === 'popular' && (
                        <IconTrendingUp size={16} style={{ color: dark ? '#8b949e' : '#64748b' }} />
                    )}
                </Group>
            </Box>
        );
    };

    return (
        <Box ref={clickOutsideRef} style={{ position: 'relative' }}>
            <TextInput
                ref={inputRef}
                value={query}
                onChange={(event) => {
                    setQuery(event.currentTarget.value);
                    setSelectedIndex(-1);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                size={size}
                radius={radius}
                variant={variant}
                leftSection={<IconSearch size={20} />}
                rightSection={
                    <Group gap="xs">
                        {isLoading && <Loader size="xs" />}
                        {showFilters && (
                            <ActionIcon variant="subtle" size="sm">
                                <IconFilter size={16} />
                            </ActionIcon>
                        )}
                        {query && (
                            <ActionIcon variant="subtle" size="sm" onClick={handleClear}>
                                <IconX size={16} />
                            </ActionIcon>
                        )}
                        <Kbd size="xs" style={{
                            background: dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)',
                            border: 'none'
                        }}>
                            <IconCommand size={12} /> K
                        </Kbd>
                    </Group>
                }
                style={getSearchBarStyles()}
                {...props}
            />

            {/* 검색 결과 드롭다운 */}
            {isOpen && (query || recentSearches.length > 0 || popularSearches.length > 0) && (
                <Paper
                    ref={resultsRef}
                    style={getResultsStyles()}
                >
                    <Stack gap={0}>
                        {/* 검색 제안 */}
                        {suggestions.length > 0 && (
                            <Box>
                                <Text
                                    size="xs"
                                    fw={600}
                                    c="dimmed"
                                    p="md"
                                    pb="xs"
                                    tt="uppercase"
                                >
                                    검색 결과
                                </Text>
                                {suggestions.slice(0, 5).map((item, index) =>
                                    renderSearchResult(item, index, 'suggestion')
                                )}
                            </Box>
                        )}

                        {/* 최근 검색어 */}
                        {!query && recentSearches.length > 0 && (
                            <Box>
                                <Text
                                    size="xs"
                                    fw={600}
                                    c="dimmed"
                                    p="md"
                                    pb="xs"
                                    tt="uppercase"
                                >
                                    최근 검색어
                                </Text>
                                {recentSearches.slice(0, 3).map((item, index) =>
                                    renderSearchResult(item, suggestions.length + index, 'recent')
                                )}
                            </Box>
                        )}

                        {/* 인기 검색어 */}
                        {!query && popularSearches.length > 0 && (
                            <Box>
                                <Text
                                    size="xs"
                                    fw={600}
                                    c="dimmed"
                                    p="md"
                                    pb="xs"
                                    tt="uppercase"
                                >
                                    인기 검색어
                                </Text>
                                {popularSearches.slice(0, 3).map((item, index) =>
                                    renderSearchResult(item, suggestions.length + recentSearches.length + index, 'popular')
                                )}
                            </Box>
                        )}

                        {/* 빈 결과 */}
                        {query && suggestions.length === 0 && !isLoading && (
                            <Box p="md" style={{ textAlign: 'center' }}>
                                <Text size="sm" c="dimmed">
                                    '{query}'에 대한 검색 결과가 없습니다.
                                </Text>
                            </Box>
                        )}
                    </Stack>
                </Paper>
            )}
        </Box>
    );
};

export default SearchBar;