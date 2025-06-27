import {Helmet} from "react-helmet-async";
import {Button, Container, Grid2, Stack, Typography} from "@mui/material";
import Icons from "../components/icon/icons";
import PostSearch from "../sections/main/blog/PostsSearch";
import posts from "../mock/blog";
import PostCard from "../sections/main/blog/PostCard";
import {NavLink} from "react-router-dom";
import Selector from "../components/common/selector";

export default function BlogPage() {
    const SORT_OPTIONS = [
        { value: 'newest', text: '최신순' },
        { value: 'oldest', text: '오래된 순' },
    ]
    return(
        <>
            <Helmet>
                <title> Main : Blog | Labit </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                        Blog
                    </Typography>

                    <Button sx={{margin: 0}} variant="contained" component={NavLink} to={"/blog/edit"} startIcon={<Icons icon="eva:plus-fill" />}>
                        작성
                    </Button>
                </Stack>
                {/*<Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>*/}
                {/*    <Typography variant={'caption'} sx={{color: 'text.secondary'}}>*/}
                {/*    </Typography>*/}
                {/*</Stack>*/}



                <Stack mb={5} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    {/*  */}

                    <PostSearch posts={posts}/>
                    <Selector options={SORT_OPTIONS} title={'정렬'}/>
                </Stack>

                <Grid2 container spacing={3}>
                    {
                        posts.map( (post, index) => (
                            <PostCard key={post.id} post={post} index={index}/>
                        ))
                    }
                </Grid2>

            </Container>
        </>
    )
}