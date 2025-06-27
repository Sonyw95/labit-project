import {format, formatDistanceToNow} from 'date-fns';


export function formatDate(date, formatter){
    const fm = formatter || 'dd MMM yyyy';
    return date ? format(new Date(date), fm) : '';
}
export function fromToNow(date){
    return date ? formatDistanceToNow( new Date(date), {
        addSuffix: true,
    }): '';
}