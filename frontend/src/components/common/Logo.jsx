import {Avatar, Box, Stack, Text} from "@mantine/core";
import logo from '@/assets/logo/logo.png';
import {useNavigate} from "react-router-dom";
import {useTheme} from "@/hooks/useTheme.js";

const LogoContent = () => {
    const navigate = useNavigate();
    return (
        <>
            {/* 로고 중앙 정렬 */}
            <Stack align="center" gap="xl" >
                <Box onClick={(e) => {
                    e.preventDefault();
                    navigate('/')
                    // window.location.href = '/';
                }}  style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
                    {/* 첫 번째 < - 색상 변화 애니메이션 */}
                    <Text
                        component="span"
                        size="md"
                        fw={500}
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
                        fw={500}
                        ff="monospace"
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
                        fw={500}
                        ff="monospace"
                        style={{
                            display: 'inline-block',
                            lineHeight: 1,
                        }}
                    >
                        &gt;
                    </Text>
                </Box>
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
const Logo = ({
                  radius = 'md',
                  size = 'sm',
                  style = {},
                  isLogo = true
              }) => {
    const {getBackgroundColor} = useTheme();

    return (

        isLogo ? (<div style={{
            width: size === 'lg' ? '48px' : '32px',
            height: size === 'lg' ? '48px' : '32px',
            backgroundColor: '#4c6ef5',
            borderRadius: radius === 'xl' ? '50%' : '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: size === 'lg' ? '18px' : '14px',
            ...style
        }}>
            <LogoContent />
        </div>) : <Avatar src={logo} style={style}/>
    )
}

export default Logo;