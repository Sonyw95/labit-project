import {memo, useMemo} from "react";
import {Box, Image} from "@mantine/core";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const PostContent = memo(({ post }) => {
    const { themeColors } = useTheme();

    const thumbnailStyle = useMemo(() => ({
        border: `1px solid ${themeColors.border}`,
        marginTop: '2rem'
    }), [themeColors.border]);

    const contentStyle = useMemo(() => ({
        lineHeight: 1.8,
        fontSize: '18px',
        color: themeColors.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: '100%',
        wordBreak: 'break-word',
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            color: themeColors.text,
            fontWeight: '700',
            marginTop: '2.5rem',
            marginBottom: '1rem',
        },
        '& p': {
            marginBottom: '1.5rem',
            lineHeight: '1.8',
        },
        '& code': {
            backgroundColor: themeColors.hover,
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.9em',
            color: themeColors.primary,
        },
        '& pre': {
            backgroundColor: themeColors.hover,
            padding: '1.5rem',
            borderRadius: '8px',
            overflow: 'auto',
            marginBottom: '1.5rem',
        },
        '& blockquote': {
            borderLeft: `4px solid ${themeColors.primary}`,
            paddingLeft: '1rem',
            marginLeft: 0,
            fontStyle: 'italic',
            color: themeColors.subText,
        },
        '& a': {
            color: themeColors.primary,
            textDecoration: 'none',
        },
        '& a:hover': {
            textDecoration: 'underline',
        }
    }), [themeColors]);

    return (
        <>
            {post.thumbnailUrl && (
                <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    height={400}
                    fit="cover"
                    radius="md"
                    style={thumbnailStyle}
                />
            )}

            {/* Post Detail Section*/}
            <Box py="xl">
                <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    style={contentStyle}
                />
            </Box>
        </>
    );
});

export default PostContent;