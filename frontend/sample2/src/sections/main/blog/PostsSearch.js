import {
    Autocomplete,
    ClickAwayListener, Fade, IconButton, InputAdornment,
    Popper,
    styled,
    TextField
} from "@mui/material";
import Icons from "../../../components/icon/icons";
import {useState} from "react";


const StylePopper = styled( (props) => <Popper placeholder="bottom-start" {...props} />)({
    width: "280px !important",
});

export default function PostSearch({ posts }){
    const [open, setOpen] = useState(false);

    const onHandleOpen = () => {
        setOpen( !open );
    }
    const onHandleClose = () => {
        setOpen(false);
    }
    return(
        <ClickAwayListener onClickAway={onHandleClose}>
            <div style={ {height: '56px'} }>
                { !open && (
                    <IconButton onClick={onHandleOpen}>
                        <Icons icon={"mdi:post-it-note-search-outline"}  />
                    </IconButton>
                )}
                <Fade in={open}  timeout={0}>
                    <Autocomplete
                        sx={{ width: 280 }}
                        autoHighlight
                        popupIcon={null}
                        PopperComponent={StylePopper}
                        options={posts}
                        getOptionLabel={(post) => post.title}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={"Search post..."}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position={"start"}>
                                            <Icons
                                                icon={"mdi:post-it-note-search-outline"}
                                                sx={{ ml: 1, width: 20, height: 20, color:"text.disabled"}}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Fade>
            </div>


            {/*
            <Autocomplete
                sx={{ width: 280 }}
                autoHighlight
                popupIcon={null}
                PopperComponent={StylePopper}
                options={posts}
                getOptionLabel={(post) => post.title}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={"Search post..."}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position={"start"}>
                                    <Icons
                                        icon={"mdi:post-it-note-search-outline"}
                                        sx={{ ml: 1, width: 20, height: 20, color:"text.disabled"}}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />
            */}
        </ClickAwayListener>

    )

}