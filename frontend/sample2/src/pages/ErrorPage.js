import PropTypes from "prop-types";
import {Helmet} from "react-helmet-async";
import {Box, Container, styled, Typography} from "@mui/material";
import Icons from "../components/icon/icons";
import Logo from "../components/Logo";


const StyleContainerContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing( 12, 0),
}))

const ErrorPage = ({ type }) => {
    ErrorPage.prototype ={
        type: PropTypes.string
    }
    const getErrorMessage = (type) => {
        let text;
        switch (type){
            case '404':
                text = '죄송합니다. 잘못된 경로이거나, 허가되지 않는 주소 입니다.';
                break;
            case '500':
                text = '죄송합니다. 서버 연결에 문제가 발생하였습니다.';
                break
        }
        return text;
    }
    const getErrorIcon = (type) => {
        let icon;
        switch (type){
            case '404':
                icon = 'line-md:bell-alert-loop';
                break;
        }
        return <Icons width={150} icon={icon} sx={{ Opacity: 0, mx: 'auto', my: {xs:5, sm: 5}} } />
    }
    return(
        <>
            <Helmet>
                <title>
                    {type}
                </title>
            </Helmet>

            <Container>
                <StyleContainerContent>
                    <Logo sx={{ width: 100, height: 100 }}/>
                    <Typography variant={'h3'} paragraph>
                        잠깐!
                    </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>
                        {getErrorMessage(type)}
                    </Typography>
                    <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                        위 로고를 클릭하여, 메인 페이지로 이동하세요.
                    </Typography>

                    <Box>
                        {getErrorIcon(type)}
                    </Box>
                </StyleContainerContent>
            </Container>
        </>
    )
}

export default ErrorPage;
