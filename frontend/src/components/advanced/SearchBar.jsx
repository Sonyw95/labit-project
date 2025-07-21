import {useCallback, useEffect, useState} from "react";
import {Badge, Box, Card, Group, Loader, rem, Stack, TextInput, Text} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";
import {useDebounce} from "@/hooks/useDebounce.js";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useClickOutside} from "@/hooks/useClickOutside.js";


export const SearchBar = ({
                              onSearch,
                              onSuggestionSelect,
                              suggestions = [],
                              placeholder = "검색어를 입력하세요...",
                              debounceMs = 300,
                              showSuggestions = true,
                              isLoading = false,
                              ...props
                          }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debouncedQuery = useDebounce(query, debounceMs);
    const { theme } = useTheme();
    const containerRef = useClickOutside(() => setIsOpen(false));

    useEffect(() => {
        if (debouncedQuery && onSearch) {
            onSearch(debouncedQuery);
        }
    }, [debouncedQuery, onSearch]);

    useEffect(() => {
        if (suggestions.length > 0 && query) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [suggestions, query]);

    const handleInputChange = useCallback((event) => {
        const value = event.target.value;
        setQuery(value);
        setSelectedIndex(-1);
    }, []);

    const handleKeyDown = useCallback((event) => {
        if (!isOpen || suggestions.length === 0) {
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case 'Enter':
                event.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else if (query.trim()) {
                    onSearch?.(query);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    }, [isOpen, suggestions, selectedIndex, query, onSearch]);

    const handleSuggestionClick = useCallback((suggestion) => {
        setQuery(suggestion.title || suggestion);
        setIsOpen(false);
        setSelectedIndex(-1);
        if (onSuggestionSelect) {
            onSuggestionSelect(suggestion);
        } else if (onSearch) {
            onSearch(suggestion.title || suggestion);
        }
    }, [onSearch, onSuggestionSelect]);

    const SuggestionItem = ({ suggestion, isSelected, onClick, theme }) => (
        <Box
            onClick={onClick}
            style={{
                padding: rem(12),
                cursor: 'pointer',
                backgroundColor: isSelected ? `${theme.colors.primary  }15` : 'transparent',
                borderBottom: `1px solid ${theme.colors.border}`,
                '&:hover': {
                    backgroundColor: `${theme.colors.primary  }10`,
                },
                '&:last-child': {
                    borderBottom: 'none',
                }
            }}
        >
            <Group justify="space-between">
                <Text size="sm" style={{ color: theme.colors.text.primary }}>
                    {suggestion.title || suggestion}
                </Text>
                {suggestion.category && (
                    <Badge size="xs" variant="light">
                        {suggestion.category}
                    </Badge>
                )}
            </Group>
            {suggestion.description && (
                <Text size="xs" style={{ color: theme.colors.text.secondary }} mt={4}>
                    {suggestion.description}
                </Text>
            )}
        </Box>
    );
    return (
        <Box ref={containerRef} style={{ position: 'relative', width: '100%' }} {...props}>
            <TextInput
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                leftSection={
                    isLoading ? (
                        <Loader size="xs" />
                    ) : (
                        <IconSearch size={16} />
                    )
                }
                style={{
                    '& input': {
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${theme.colors.border}`,
                        '&:focus': {
                            borderColor: theme.colors.primary,
                            boxShadow: `0 0 0 2px ${theme.colors.primary}25`,
                        }
                    }
                }}
            />

            {isOpen && showSuggestions && suggestions.length > 0 && (
                <Card
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        marginTop: rem(4),
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: theme.shadows.lg,
                        maxHeight: rem(300),
                        overflowY: 'auto',
                    }}
                    p={0}
                    radius="md"
                >
                    <Stack gap={0}>
                        {suggestions.map((suggestion, index) => (
                            <SuggestionItem
                                key={suggestion.id || index}
                                suggestion={suggestion}
                                isSelected={index === selectedIndex}
                                onClick={() => handleSuggestionClick(suggestion)}
                                theme={theme}
                            />
                        ))}
                    </Stack>
                </Card>
            )}
        </Box>
    );
};