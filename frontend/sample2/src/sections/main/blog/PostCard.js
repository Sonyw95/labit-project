import PropTypes from "prop-types";
import {Avatar, Box, Card, CardContent, Grid, Grid2, Link, styled, Typography} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {formatDate} from "../../../utils/formatUitls";
import SvgBox from "../../../components/svg/SvgBox";
import useResponsive from "../../../hooks/useResponsive";
import {NavLink} from "react-router-dom";
import Icons from "../../../components/icon/icons";



const StyleCardMedia = styled('div')({
    position: 'relative',
    paddingTop: 'calc(100% * 3 / 4)',
});
const StyleCardTitle = styled(Link)({
    height: 44,
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    '&:hover': {
        cursor: 'pointer',
    }
});
const StyleInfo = styled('div')( ({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    color: theme.palette.text.disabled,
}));
const StyleAvatar = styled(Avatar)(({theme}) => ({
    zIndex: 9,
    width: 32,
    height: 32,
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(-2),
}))
const StyleCover = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
})

PostCard.prototype = {
    post: PropTypes.object.isRequired,
    index: PropTypes.number,
};
export default function PostCard( { post, index } ){
    const isDesktop = useResponsive('up', 'md');

    const { cover, title, view, comment, author, createAt } = post,
        lastPostLarge = index === 0,
        latestPost = index === 1;

    const POST_INFO = [
        { number: comment, icon: "eva:message-circle-fill" },
        { number: view, icon: "eva:eye-fill" },
    ];

    return (
        <Grid2 size={{ xs: 12, sx: lastPostLarge ? 12 : 6, md: lastPostLarge ? 8 : 4}}>
            <Card sx={{ position: 'relative' }}>
                <StyleCardMedia
                    sx={{
                        ...((lastPostLarge || ( latestPost && isDesktop )) && {
                            pt: 'calc(100% * 4 / 2.9)',
                            '&:after': {
                                top: 0,
                                content: "''",
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            },
                        }),
                        ...(!(lastPostLarge || ( latestPost && isDesktop )) && {
                            pt: {
                                md: 'calc(100% * 3 / 4)',
                                sm: 'calc(100% * 3 / 5.96)',
                            },
                        }),
                        ...(lastPostLarge && {
                            pt: {
                                xs: 'calc(100% * 3 / 6)',
                                sm: 'calc(100% * 4 / 6)',
                            },
                        }),
                    }}
                >
                    <SvgBox
                        color={"paper"}
                        src={"/resources/icons/avatar-mount.svg"}
                        sx={{
                            width: 80,
                            height: 36,
                            right:0,
                            zIndex: 9,
                            bottom: -15,
                            position: 'absolute',
                            color: 'background.paper',
                            ...( (lastPostLarge || ( latestPost && isDesktop )) && {display: 'none'} )
                        }}
                    />
                    <StyleAvatar
                        alt={author.name}
                        src={author.avatarUrl}
                        sx={{
                            ...(( lastPostLarge || ( latestPost && isDesktop ) ) && {
                                zIndex: 9,
                                top: 24,
                                left: 24,
                                width: 40,
                                height: 40,
                            })
                        }}
                    />
                    <StyleCover akt={title} src={cover}/>
                </StyleCardMedia>

                <CardContent
                    sx={{
                        pt: 4,
                        ...((lastPostLarge || ( latestPost && isDesktop )) && {
                            bottom: 0,
                            width: '100%',
                            position: 'absolute',
                        })
                    }}
                >
                    <Typography gutterBottom variant={"caption"} sx={{ color: 'text.disabled', display: 'block' }}>
                        {formatDate( createAt )}
                    </Typography>

                    <StyleCardTitle
                        component={NavLink}
                        to={"/blog/post?id=1"}
                        color="inherit"
                        variant="subtitle2"
                        underline={'none'}
                        sx={{
                            ...(lastPostLarge && { typography: 'h5', height: 60 }),
                            ...((lastPostLarge || (latestPost && isDesktop)) && {
                                color: 'common.white',
                            }),
                        }}
                    >
                        {title}
                    </StyleCardTitle>

                    {/*
 <StyleInfo>
                        {POST_INFO.map ( (info, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    ml: index === 0 ? 0 : 1.5,
                                    ...( (lastPostLarge || latestPost) && {
                                        color: 'grey.500',
                                    } )
                                }}
                            >
                                <Icons icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }}/>
                                <Typography variant={"caption"}>{}</Typography>
                            </Box>
                        ))}
                    </StyleInfo>
                    */}

                </CardContent>
            </Card>
        </Grid2>
    )
}
