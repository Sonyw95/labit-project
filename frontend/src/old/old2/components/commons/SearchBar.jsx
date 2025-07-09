import React, { useState, useCallback, useMemo } from 'react';
import { TextInput, Combobox, useCombobox, Group, Text, Loader, Kbd, rem } from '@mantine/core';
import { IconSearch, IconHistory, IconTrendingUp } from '@tabler/icons-react';
import { useFocusWithin } from '@mantine/hooks';
import {useDebounce} from "@/hooks/useDebounce.js";

const SearchBar = ({
                       placeholder = '검색어를 입력하세요...',
                       onSearch,
                       suggestions = [],
                       recentSearches = [],
                       popularSearches = [],
                       loading = false,
                       size = 'md',
                       radius = 'xl',
                       ...props
                   }) => {
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);
    const debouncedValue = useDebounce(value, 300);
    const combobox = useCombobox();
    const { ref, focused: focusWithin } = useFocusWithin();

    // 검색 실행
    const handleSearch = useCallback((searchValue) => {
        if (searchValue.trim()) {
            onSearch?.(searchValue.trim());
            combobox.closeDropdown();
            setFocused(false);
        }
    }, [onSearch, combobox]);

    // 제안 항목들 생성
    const allSuggestions = useMemo(() => {
        const filtered = suggestions.filter(item =>
            item.toLowerCase().includes(debouncedValue.toLowerCase())
        );

        return [
            ...filtered.slice(0, 5),
            ...(debouncedValue === '' ? recentSearches.slice(0, 3) : []),
            ...(debouncedValue === '' ? popularSearches.slice(0, 3) : [])
        ];
    }, [suggestions, debouncedValue, recentSearches, popularSearches]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter') {
            handleSearch(value);
        }
        if (event.key === 'Escape') {
            combobox.closeDropdown();
            setFocused(false);
        }
    }, [value, handleSearch, combobox]);

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(val) => handleSearch(val)}
            opened={focused && (allSuggestions.length > 0 || loading)}
        >
            <Combobox.Target>
                <div ref={ref}>
                    <TextInput
                        value={value}
                        onChange={(event) => setValue(event.currentTarget.value)}
                        onFocus={() => {
                            setFocused(true);
                            combobox.openDropdown();
                        }}
                        onBlur={() => {
                            setTimeout(() => {
                                if (!focusWithin) {
                                    setFocused(false);
                                    combobox.closeDropdown();
                                }
                            }, 100);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        size={size}
                        radius={radius}
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            loading ? <Loader size={16} /> :
                                <Kbd size="xs">⌘K</Kbd>
                        }
                        style={{
                            transition: 'all 0.2s ease',
                            '&:focus-within': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                            }
                        }}
                        {...props}
                    />
                </div>
            </Combobox.Target>

            <Combobox.Dropdown
                style={{
                    backdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: rem(12),
                    padding: rem(8),
                    marginTop: rem(4),
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Combobox.Options>
                    {loading ? (
                        <Combobox.Option value="">
                            <Group>
                                <Loader size="xs" />
                                <Text size="sm">검색 중...</Text>
                            </Group>
                        </Combobox.Option>
                    ) : (
                        allSuggestions.map((item, index) => {
                            const isRecent = recentSearches.includes(item);
                            const isPopular = popularSearches.includes(item);

                            return (
                                <Combobox.Option value={item} key={index}>
                                    <Group>
                                        {isRecent && <IconHistory size={14} color="gray" />}
                                        {isPopular && <IconTrendingUp size={14} color="orange" />}
                                        {!isRecent && !isPopular && <IconSearch size={14} color="gray" />}
                                        <Text size="sm">{item}</Text>
                                    </Group>
                                </Combobox.Option>
                            );
                        })
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

export default SearchBar;