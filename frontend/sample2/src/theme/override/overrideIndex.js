import Card from "./component/Card";
import Tables from "./component/Table";
import Input from "./component/Input";
import Paper from "./component/Paper";
import Button from "./component/Button";
import Tooltip from "./component/Tooltip";
import Backdrop from "./component/Backdrop";
import Typography from "./component/Typography";
import Autocomplete from "./component/Autocomplete";


export default function overrideComponentTheme(theme){
    return Object.assign(
        Card(theme),
        Tables(theme),
        Input(theme),
        Paper(theme),
        Button(theme),
        Tooltip(theme),
        Backdrop(theme),
        Typography(theme),
        Autocomplete(theme),
    );
};