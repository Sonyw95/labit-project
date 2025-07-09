import {useRef, useState} from "react";
import {Box, rem} from "@mantine/core";

export const SearchBar = ({
                                                        placeholder = "검색어를 입력하세요...",
                                                        onSearch,
                                                        loading = false,
                                                        suggestions = [],
                                                    }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    setQuery(suggestions[selectedIndex]);
                    onSearch(suggestions[selectedIndex]);
                    setIsOpen(false);
                } else {
                    handleSubmit(e);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    return (
        <Box style={{ position: 'relative', width: '100%', maxWidth: rem(400) }}>
            <form onSubmit={handleSubmit}>
                <Box
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        background: '#ffffff',
                        border: '2px solid #e5e7eb',
                        borderRadius: rem(12),
                        padding: `${rem(12)} ${rem(16)}`,
                        transition: 'all 0.2s ease',
                        '&:focus-within': {
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                        }
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(e.target.value.length > 0);
                            setSelectedIndex(-1);
                        }}
                        onFocus={() => setIsOpen(query.length > 0)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: rem(14),
                            background: 'transparent',
                        }}
                    />
                    {loading && (
                        <Box
                            style={{
                                width: rem(16),
                                height: rem(16),
                                border: '2px solid #e5e7eb',
                                borderTop: '2px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }}
                        />
                    )}
                </Box>
            </form>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <Box
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: rem(12),
                        marginTop: rem(4),
                        maxHeight: rem(200),
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {suggestions.map((suggestion, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                setQuery(suggestion);
                                onSearch(suggestion);
                                setIsOpen(false);
                            }}
                            style={{
                                padding: `${rem(12)} ${rem(16)}`,
                                cursor: 'pointer',
                                background: index === selectedIndex ? '#f3f4f6' : 'transparent',
                                borderRadius: index === 0 ? `${rem(12)} ${rem(12)} 0 0` :
                                    index === suggestions.length - 1 ? `0 0 ${rem(12)} ${rem(12)}` : '0',
                                '&:hover': {
                                    background: '#f3f4f6',
                                }
                            }}
                        >
                            <Text size="sm">{suggestion}</Text>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};