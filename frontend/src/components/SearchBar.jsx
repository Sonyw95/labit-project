import React, { useState, useEffect, useRef } from 'react';
import {
    TextInput,
    Group,
    ActionIcon,
    Paper,
    Text,
    Stack,
    Highlight,
    ScrollArea,
    Badge,
    Box,
    Kbd,
    useMantineColorScheme,
    Portal,
    Transition,
} from '@mantine/core';
import {
    IconSearch,
    IconX,
    IconHistory,
    IconTrendingUp,
    IconCommand,
} from '@tabler/icons-react';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SearchBar = ({
                       placeholder = "검색어를 입력하세요...",
                       onSearch,
                       onSelect,
                       data = [],
                       searchFields = ['title', 'content'],
                       maxResults = 10,
                       showHistory = true,
                       showShortcut = true,
                       size = 'md',
                       ...props
                   }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);

    const debouncedQuery = useDebounce(query, 300);
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    // Search function
    const performSearch = (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const filteredResults = data.filter(item => {
            return searchFields.some(field => {
                const value = item[field];
                return value && value.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }).slice(0, maxResults);

        setResults(filteredResults);
    };

    // Handle debounced search
    useEffect(() => {
        if (debouncedQuery) {
            performSearch(debouncedQuery);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [debouncedQuery, data]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Cmd/Ctrl + K to focus search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }

            // Escape to close
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle input keyboard navigation
    const handleKeyDown = (e) => {
        const totalItems = results.length + (showHistory ? searchHistory.length : 0);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % totalItems);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    const item = selectedIndex < results.length
                        ? results[selectedIndex]
                        : searchHistory[selectedIndex - results.length];
                    handleSelect(item);
                } else if (query.trim()) {
                    handleSearch();
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    // Handle search submission
    const handleSearch = () => {
        if (!query.trim()) return;

        // Add to history
        if (showHistory) {
            const newHistory = [
                query,
                ...searchHistory.filter(item => item !== query)
            ].slice(0, 10);
            setSearchHistory(newHistory);
        }

        onSearch?.(query);
        setIsOpen(false);
        setQuery('');
    };

    // Handle item selection
    const handleSelect = (item) => {
        if (typeof item === 'string') {
            // History item
            setQuery(item);
            performSearch(item);
        } else {
            // Search result
            onSelect?.(item);
            setIsOpen(false);
            setQuery('');
        }
        setSelectedIndex(-1);
    };

    // Clear search
    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    };

    // Clear history
    const clearHistory = () => {
        setSearchHistory([]);
    };

    const shouldShowDropdown = isOpen && (results.length > 0 || (showHistory && searchHistory.length > 0 && !query));

    return (
        <Box style={{ position: 'relative', width: '100%' }}>
            <TextInput
                ref={inputRef}
                size={size}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                leftSection={<IconSearch size={16} />}
                rightSection={
                    <Group gap="xs">
                        {query && (
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                onClick={handleClear}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        )}
                        {showShortcut && !query && (
                            <Group gap={4}>
                                <Kbd size="xs">⌘</Kbd>
                                <Kbd size="xs">K</Kbd>
                            </Group>
                        )}
                    </Group>
                }
                style={{
                    '& input': {
                        paddingRight: query ? '60px' : showShortcut ? '80px' : '40px',
                    }
                }}
                {...props}
            />

            <Portal>
                <Transition
                    mounted={shouldShowDropdown}
                    transition="fade"
                    duration={200}
                >
                    {(styles) => {
                        const inputRect = inputRef.current?.getBoundingClientRect();
                        if (!inputRect) return null;

                        return (
                            <Paper
                                ref={resultsRef}
                                style={{
                                    ...styles,
                                    position: 'fixed',
                                    top: inputRect.bottom + 8,
                                    left: inputRect.left,
                                    width: inputRect.width,
                                    maxHeight: 400,
                                    zIndex: 1000,
                                    background: dark ? '#161b22' : '#ffffff',
                                    border: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
                                    boxShadow: dark
                                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                                }}
                                p="xs"
                            >
                                <ScrollArea style={{ maxHeight: 350 }}>
                                    <Stack gap="xs">
                                        {/* Search Results */}
                                        {results.length > 0 && (
                                            <>
                                                <Group justify="space-between" px="sm" py="xs">
                                                    <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                        검색 결과
                                                    </Text>
                                                    <Badge size="xs" variant="light">
                                                        {results.length}
                                                    </Badge>
                                                </Group>
                                                {results.map((item, index) => (
                                                    <Paper
                                                        key={item.id || index}
                                                        p="sm"
                                                        style={{
                                                            cursor: 'pointer',
                                                            background: selectedIndex === index
                                                                ? (dark ? '#21262d' : '#f3f4f6')
                                                                : 'transparent',
                                                            border: 'none',
                                                            borderRadius: 6,
                                                        }}
                                                        onClick={() => handleSelect(item)}
                                                    >
                                                        <Stack gap="xs">
                                                            <Highlight
                                                                highlight={query}
                                                                size="sm"
                                                                fw={500}
                                                            >
                                                                {item.title || item.name || 'Untitled'}
                                                            </Highlight>
                                                            {item.description && (
                                                                <Highlight
                                                                    highlight={query}
                                                                    size="xs"
                                                                    c="dimmed"
                                                                    lineClamp={2}
                                                                >
                                                                    {item.description}
                                                                </Highlight>
                                                            )}
                                                            {item.tags && (
                                                                <Group gap="xs">
                                                                    {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                                                        <Badge key={tagIndex} size="xs" variant="light">
                                                                            {tag}
                                                                        </Badge>
                                                                    ))}
                                                                </Group>
                                                            )}
                                                        </Stack>
                                                    </Paper>
                                                ))}
                                            </>
                                        )}

                                        {/* Search History */}
                                        {showHistory && searchHistory.length > 0 && !query && (
                                            <>
                                                <Group justify="space-between" px="sm" py="xs">
                                                    <Group gap="xs">
                                                        <IconHistory size={14} />
                                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                            최근 검색
                                                        </Text>
                                                    </Group>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        size="xs"
                                                        onClick={clearHistory}
                                                    >
                                                        <IconX size={12} />
                                                    </ActionIcon>
                                                </Group>
                                                {searchHistory.map((historyItem, index) => (
                                                    <Paper
                                                        key={index}
                                                        p="sm"
                                                        style={{
                                                            cursor: 'pointer',
                                                            background: selectedIndex === (results.length + index)
                                                                ? (dark ? '#21262d' : '#f3f4f6')
                                                                : 'transparent',
                                                            border: 'none',
                                                            borderRadius: 6,
                                                        }}
                                                        onClick={() => handleSelect(historyItem)}
                                                    >
                                                        <Group gap="sm">
                                                            <IconHistory size={14} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                                                            <Text size="sm">{historyItem}</Text>
                                                        </Group>
                                                    </Paper>
                                                ))}
                                            </>
                                        )}

                                        {/* No Results */}
                                        {query && results.length === 0 && (
                                            <Box p="lg" style={{ textAlign: 'center' }}>
                                                <Stack gap="xs" align="center">
                                                    <IconSearch size={24} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                                                    <Text size="sm" c="dimmed">
                                                        "{query}"에 대한 검색 결과가 없습니다
                                                    </Text>
                                                </Stack>
                                            </Box>
                                        )}

                                        {/* Popular Searches */}
                                        {!query && results.length === 0 && (!showHistory || searchHistory.length === 0) && (
                                            <>
                                                <Group justify="space-between" px="sm" py="xs">
                                                    <Group gap="xs">
                                                        <IconTrendingUp size={14} />
                                                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                            인기 검색어
                                                        </Text>
                                                    </Group>
                                                </Group>
                                                {['React', 'Spring Boot', 'Java', 'TypeScript', 'AWS'].map((term, index) => (
                                                    <Paper
                                                        key={term}
                                                        p="sm"
                                                        style={{
                                                            cursor: 'pointer',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderRadius: 6,
                                                        }}
                                                        onClick={() => handleSelect(term)}
                                                    >
                                                        <Group gap="sm">
                                                            <Text size="xs" c="dimmed" style={{ minWidth: 20 }}>
                                                                {index + 1}
                                                            </Text>
                                                            <Text size="sm">{term}</Text>
                                                        </Group>
                                                    </Paper>
                                                ))}
                                            </>
                                        )}
                                    </Stack>
                                </ScrollArea>
                            </Paper>
                        );
                    }}
                </Transition>
            </Portal>

            {/* Overlay to close dropdown */}
            {shouldShowDropdown && (
                <Box
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                    }}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </Box>
    );
};

export default SearchBar;