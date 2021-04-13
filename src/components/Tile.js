import classnames from 'classnames';


export default function Tile(props) {
    // return (
    //     <button className={classnames(props.className, props.active, props.value)} onClick={props.onClick}>
    //     </button>
    // );
    return (
        <button className={classnames(props.className, props.active, props.value)} onClick={props.onClick}>
        </button>
    );
}