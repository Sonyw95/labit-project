// Formatter utility functions
export const formatters = {
    // Date formatters
    date: {
        // Format date to Korean style
        toKorean: (date) => {
            const d = new Date(date);
            return d.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        // Format date to relative time
        toRelative: (date) => {
            const now = new Date();
            const target = new Date(date);
            const diffInSeconds = Math.floor((now - target) / 1000);

            const intervals = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                minute: 60
            };

            for (const [unit, seconds] of Object.entries(intervals)) {
                const interval = Math.floor(diffInSeconds / seconds);
                if (interval >= 1) {
                    return `${interval}${unit === 'year' ? '년' : unit === 'month' ? '개월' : unit === 'week' ? '주' : unit === 'day' ? '일' : unit === 'hour' ? '시간' : '분'} 전`;
                }
            }

            return '방금 전';
        },

        // Format to ISO string
        toISO: (date) => {
            return new Date(date).toISOString();
        },

        // Format to custom pattern
        format: (date, pattern = 'YYYY-MM-DD') => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');

            return pattern
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        }
    },

    // Number formatters
    number: {
        // Format to Korean currency
        toCurrency: (number, currency = 'KRW') => {
            return new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: currency
            }).format(number);
        },

        // Format with thousand separators
        withCommas: (number) => {
            return new Intl.NumberFormat('ko-KR').format(number);
        },

        // Format to percentage
        toPercentage: (number, decimals = 1) => {
            return `${(number * 100).toFixed(decimals)}%`;
        },

        // Format file size
        toFileSize: (bytes) => {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        // Format to compact notation
        toCompact: (number) => {
            return new Intl.NumberFormat('ko-KR', {
                notation: 'compact'
            }).format(number);
        },

        // Format to ordinal
        toOrdinal: (number) => {
            const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
            const suffixes = {
                'one': 'st',
                'two': 'nd',
                'few': 'rd',
                'other': 'th'
            };
            return `${number}${suffixes[pr.select(number)]}`;
        }
    },

    // String formatters
    string: {
        // Capitalize first letter
        capitalize: (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        // Convert to title case
        toTitleCase: (str) => {
            return str.replace(/\w\S*/g, (txt) =>
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        },

        // Convert to camelCase
        toCamelCase: (str) => {
            return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        },

        // Convert to kebab-case
        toKebabCase: (str) => {
            return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        },

        // Convert to snake_case
        toSnakeCase: (str) => {
            return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
        },

        // Truncate with ellipsis
        truncate: (str, length = 100, ending = '...') => {
            if (str.length <= length) return str;
            return str.substring(0, length - ending.length) + ending;
        },

        // Remove HTML tags
        stripHtml: (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        },

        // Generate slug
        toSlug: (str) => {
            return str
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },

        // Extract initials
        getInitials: (name) => {
            return name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase())
                .join('');
        },

        // Mask sensitive data
        mask: (str, maskChar = '*', visibleChars = 4) => {
            if (str.length <= visibleChars * 2) return str;
            const start = str.substring(0, visibleChars);
            const end = str.substring(str.length - visibleChars);
            const middle = maskChar.repeat(str.length - visibleChars * 2);
            return start + middle + end;
        }
    },

    // Array formatters
    array: {
        // Join with proper grammar
        toSentence: (arr, separator = ', ', lastSeparator = ' and ') => {
            if (arr.length === 0) return '';
            if (arr.length === 1) return arr[0];
            if (arr.length === 2) return arr.join(lastSeparator);

            return arr.slice(0, -1).join(separator) + lastSeparator + arr[arr.length - 1];
        },

        // Group by key
        groupBy: (arr, key) => {
            return arr.reduce((groups, item) => {
                const group = item[key];
                groups[group] = groups[group] || [];
                groups[group].push(item);
                return groups;
            }, {});
        },

        // Chunk array
        chunk: (arr, size) => {
            const chunks = [];
            for (let i = 0; i < arr.length; i += size) {
                chunks.push(arr.slice(i, i + size));
            }
            return chunks;
        }
    },

    // URL formatters
    url: {
        // Add protocol if missing
        addProtocol: (url) => {
            if (!/^https?:\/\//i.test(url)) {
                return 'https://' + url;
            }
            return url;
        },

        // Extract domain
        getDomain: (url) => {
            try {
                return new URL(url).hostname;
            } catch {
                return '';
            }
        },

        // Build query string
        buildQuery: (params) => {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    searchParams.append(key, value);
                }
            });
            return searchParams.toString();
        }
    },

    // Color formatters
    color: {
        // Convert hex to rgba
        hexToRgba: (hex, alpha = 1) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        },

        // Get contrast color
        getContrast: (hex) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? '#000000' : '#ffffff';
        }
    },

    // Phone number formatter
    phone: {
        // Format Korean phone number
        korean: (phoneNumber) => {
            const cleaned = phoneNumber.replace(/\D/g, '');

            if (cleaned.length === 11) {
                return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (cleaned.length === 10) {
                return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }

            return phoneNumber;
        },

        // International format
        international: (phoneNumber, countryCode = '+82') => {
            const cleaned = phoneNumber.replace(/\D/g, '');
            return `${countryCode} ${cleaned}`;
        }
    },

    // Email formatter
    email: {
        // Validate email format
        isValid: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Extract domain from email
        getDomain: (email) => {
            return email.split('@')[1] || '';
        },

        // Obfuscate email
        obfuscate: (email) => {
            const [username, domain] = email.split('@');
            const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
            return `${maskedUsername}@${domain}`;
        }
    }
};