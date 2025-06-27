import {forwardRef, useState} from "react";
import {Avatar, Box} from "@mantine/core";
import logo from '../assets/logo/logo.png';
// eslint-disable-next-line no-duplicate-imports
import {
    Text,
    Stack,
} from '@mantine/core';
import {NavLink} from "react-router-dom";

const LogoContent = (dark) => {
    return (
        <>
            {/* 로고 중앙 정렬 */}
            <Stack align="center" gap="xl">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    {/* 첫 번째 < - 색상 변화 애니메이션 */}
                    <Text
                        component="span"
                        size="md"
                        fw={700}
                        ff="monospace"
                        style={{
                            animation: 'colorChange 3s infinite',
                            display: 'inline-block',
                            lineHeight: 1,
                        }}
                    >
                        &lt;
                    </Text>

                    {/* 두 번째 / - 회전 애니메이션 */}
                    <Text
                        component="span"
                        size="md"
                        fw={700}
                        ff="monospace"
                        c={dark ? 'orange.4' : 'orange.6'}
                        style={{
                            animation: 'rotateAfterDelay 4s infinite',
                            // animationDelay: '0s',
                            display: 'inline-block',
                            transformOrigin: 'center',
                            lineHeight: 1,
                        }}
                    >
                        /
                    </Text>

                    {/* 세 번째 > - 기본 색상 */}
                    <Text
                        component="span"
                        size="md"
                        fw={700}
                        ff="monospace"
                        c={dark ? 'gray.3' : 'gray.7'}
                        style={{
                            display: 'inline-block',
                            lineHeight: 1,
                        }}
                    >
                        &gt;
                    </Text>
                </div>
            </Stack>

            {/* CSS 애니메이션 정의 */}
            <style>{`
        @keyframes colorChange {
          0% { color: var(--mantine-color-red-5); }
          16.67% { color: var(--mantine-color-orange-5); }
          33.33% { color: var(--mantine-color-yellow-5); }
          50% { color: var(--mantine-color-green-5); }
          66.67% { color: var(--mantine-color-gray-5); }
          83.33% { color: var(--mantine-color-violet-5); }
          100% { color: var(--mantine-color-red-5); }
        }

        @keyframes rotateAfterDelay {
          0%, 50% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
};
const Logo = forwardRef( ({ href, isLogo = true, dark, ...style}, ref) => {
    const [colorScheme, setColorScheme] = useState('light');

    if( isLogo ){
        return (
            <Box
                component={NavLink}
                to={href}
                style={{
                transition: 'background-color 0.3s ease',
                cursor:'pointer'
            }}>
                <LogoContent dark={dark}/>
            </Box>
        );
    }else{
        return(
            <Avatar src={logo} {...style}/>
        )
    }
});

export default Logo;
