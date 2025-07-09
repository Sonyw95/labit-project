import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
    TextInput,
    Popover,
    Stack,
    Text,
    Group,
    Highlight,
    Box,
    Loader,
    Divider,
    ScrollArea,
    CloseButton,
    Badge,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconSearch,
    IconHistory,
    IconTrendingUp,
} from '@tabler/icons-react';
import {useDebounce} from "../../hooks/useDebounce.js";
import {useClickOutside} from "../../hooks/useClickOutside.js";
import {storage} from "../../utils/storage.js";
import {apiClient} from "../../services/apiClient.js";

// SearchBar 컴포넌트
const SearchBar = memo(({
                            placeholder = "검색어를 입력하세요...",
                            onSearch,
                            showSuggestions = true,
                            showHistory = true,
                            showTrending = true,
                            maxHistoryItems = 5,
                            maxSuggestions = 8,
                            debounceMs = 300,
                            size = 'md',
                            style,
                            ...props
                        }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [trendingQueries, setTrendingQueries] = useState([]);

    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const debouncedQuery = useDebounce(query, debounceMs);
    const clickOutsideRef = useClickOutside(() => setIsOpen(false));

    // 검색 기록 로드
    useEffect(() => {
        if (showHistory) {
            const history = storage.local.get('search_history', []);
            setSearchHistory(history.slice(0, maxHistoryItems));
        }
    }, [showHistory, maxHistoryItems]);

    // // 인기 검색어 로드
    // useEffect(() => {
    //     if (showTrending) {
    //         const loadTrending = async () => {
    //             try {
    //                 const response = await apiClient.search.trending();
    //                 setTrendingQueries(response.data.slice(0, 5));
    //             } catch (error) {
    //                 console.error('Failed to load trending queries:', error);
    //             }
    //         };
    //         loadTrending();
    //     }
    // }, [showTrending]);

    // 자동완성 검색
    useEffect(() => {
        if (debouncedQuery && showSuggestions) {
            const fetchSuggestions = async () => {
                setLoading(true);
                try {
                    const response = await apiClient.search.suggestions(debouncedQuery);
                    setSuggestions(response.data.slice(0, maxSuggestions));
                } catch (error) {
                    console.error('Failed to fetch suggestions:', error);
                    setSuggestions([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
            setLoading(false);
        }
    }, [debouncedQuery, showSuggestions, maxSuggestions]);

    // 검색 실행
    const handleSearch = useCallback((searchQuery) => {
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) {
            return;
        }
        // 검색 기록에 추가
        if (showHistory) {
            const newHistory = [
                trimmedQuery,
                ...searchHistory.filter(item => item !== trimmedQuery)
            ].slice(0, maxHistoryItems);

            setSearchHistory(newHistory);
            storage.local.set('search_history', newHistory);
        }

        setIsOpen(false);
        onSearch?.(trimmedQuery);
    }, [searchHistory, onSearch, showHistory, maxHistoryItems]);

    // 엔터 키 처리
    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter') {
            handleSearch(query);
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    }, [query, handleSearch]);

    // 검색어 클릭
    const handleQueryClick = useCallback((clickedQuery) => {
        setQuery(clickedQuery);
        handleSearch(clickedQuery);
    }, [handleSearch]);

    // 검색 기록 삭제
    const removeFromHistory = useCallback((queryToRemove) => {
        const newHistory = searchHistory.filter(item => item !== queryToRemove);
        setSearchHistory(newHistory);
        storage.local.set('search_history', newHistory);
    }, [searchHistory]);

    // 검색 기록 전체 삭제
    const clearHistory = useCallback(() => {
        setSearchHistory([]);
        storage.local.remove('search_history');
    }, []);

    const hasContent = useMemo(() =>
            query || searchHistory.length > 0 || trendingQueries.length > 0,
        [query, searchHistory.length, trendingQueries.length]
    );

    return (
        <Box ref={clickOutsideRef} style={{ position: 'relative', ...style }}>
            <Popover
                opened={isOpen && hasContent}
                position="bottom-start"
                width="target"
                shadow="md"
                withArrow={false}
                offset={4}
            >
                <Popover.Target>
                    <TextInput
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        size={size}
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            query && (
                                <CloseButton
                                    size="sm"
                                    onClick={() => setQuery('')}
                                    style={{ color: dark ? '#8b949e' : '#6b7280' }}
                                />
                            )
                        }
                        styles={{
                            input: {
                                background: dark ? '#161b22' : '#ffffff',
                                border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                                color: dark ? '#f0f6fc' : '#1e293b',
                                '&:focus': {
                                    borderColor: '#4c6ef5',
                                    boxShadow: '0 0 0 1px #4c6ef5',
                                }
                            }
                        }}
                        {...props}
                    />
                </Popover.Target>

                <Popover.Dropdown
                    p={0}
                    style={{
                        background: dark ? '#161b22' : '#ffffff',
                        border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                        maxHeight: rem(400),
                        overflow: 'hidden',
                    }}
                >
                    <ScrollArea h="100%" scrollbarSize={4}>
                        <Stack gap={0}>
                            {/* 로딩 상태 */}
                            {loading && (
                                <Group p="md" gap="xs">
                                    <Loader size="sm" />
                                    <Text size="sm" c="dimmed">검색 중...</Text>
                                </Group>
                            )}

                            {/* 검색 제안 */}
                            {suggestions.length > 0 && (
                                <Box>
                                    {suggestions.map((suggestion, index) => (
                                        <Box
                                            key={index}
                                            p="sm"
                                            onClick={() => handleQueryClick(suggestion)}
                                            style={{
                                                cursor: 'pointer',
                                                background: 'transparent',
                                                transition: 'background-color 0.15s ease',
                                                '&:hover': {
                                                    background: dark ? '#21262d' : '#f3f4f6',
                                                }
                                            }}
                                        >
                                            <Group gap="xs">
                                                <IconSearch size={14} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                                                <Highlight highlight={query} size="sm">
                                                    {suggestion}
                                                </Highlight>
                                            </Group>
                                        </Box>
                                    ))}
                                    <Divider color={dark ? '#30363d' : '#e5e7eb'} />
                                </Box>
                            )}

                            {/* 검색 기록 */}
                            {!query && searchHistory.length > 0 && (
                                <Box>
                                    <Group justify="space-between" p="sm" pb="xs">
                                        <Group gap="xs">
                                            <IconHistory size={14} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                                            <Text size="xs" c="dimmed" fw={600}>최근 검색</Text>
                                        </Group>
                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            onClick={clearHistory}
                                            style={{ cursor: 'pointer', '&:hover': { color: '#4c6ef5' } }}
                                        >
                                            전체 삭제
                                        </Text>
                                    </Group>

                                    {searchHistory.map((historyItem, index) => (
                                        <Box
                                            key={index}
                                            p="sm"
                                            style={{
                                                cursor: 'pointer',
                                                background: 'transparent',
                                                transition: 'background-color 0.15s ease',
                                                '&:hover': {
                                                    background: dark ? '#21262d' : '#f3f4f6',
                                                }
                                            }}
                                        >
                                            <Group justify="space-between">
                                                <Text
                                                    size="sm"
                                                    onClick={() => handleQueryClick(historyItem)}
                                                    style={{ flex: 1 }}
                                                >
                                                    {historyItem}
                                                </Text>
                                                <CloseButton
                                                    size="xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFromHistory(historyItem);
                                                    }}
                                                />
                                            </Group>
                                        </Box>
                                    ))}

                                    {trendingQueries.length > 0 && (
                                        <Divider color={dark ? '#30363d' : '#e5e7eb'} />
                                    )}
                                </Box>
                            )}

                            {/* 인기 검색어 */}
                            {!query && trendingQueries.length > 0 && (
                                <Box>
                                    <Group gap="xs" p="sm" pb="xs">
                                        <IconTrendingUp size={14} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                                        <Text size="xs" c="dimmed" fw={600}>인기 검색어</Text>
                                    </Group>

                                    <Group p="sm" pt={0} gap="xs">
                                        {trendingQueries.map((trendingQuery, index) => (
                                            <Badge
                                                key={index}
                                                size="sm"
                                                variant="light"
                                                onClick={() => handleQueryClick(trendingQuery)}
                                                style={{
                                                    cursor: 'pointer',
                                                    background: dark ? '#21262d' : '#f3f4f6',
                                                    color: dark ? '#f0f6fc' : '#1e293b',
                                                    border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                                                    '&:hover': {
                                                        background: dark ? '#30363d' : '#e5e7eb',
                                                    }
                                                }}
                                            >
                                                {trendingQuery}
                                            </Badge>
                                        ))}
                                    </Group>
                                </Box>
                            )}

                            {/* 검색 결과가 없을 때 */}
                            {query && !loading && suggestions.length === 0 && (
                                <Box p="md">
                                    <Text size="sm" c="dimmed" ta="center">
                                        "{query}"에 대한 검색 결과가 없습니다.
                                    </Text>
                                </Box>
                            )}
                        </Stack>
                    </ScrollArea>
                </Popover.Dropdown>
            </Popover>
        </Box>
    );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;