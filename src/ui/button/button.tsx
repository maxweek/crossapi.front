import { FC, ReactNode } from "react";
import './styles.scss';
import { getCl, getClR } from "../../helper";
import Icon, { IIconName } from "../icon/icon";
import { NavLink } from "react-router-dom";

interface Props {
    type: 'primary' | 'secondary' | 'tretiary' | 'simple' | 'arrow' | 'indicator',
    children?: ReactNode,
    icon?: IIconName['name'],
    loading?: boolean,
    onClick?: () => void,
    disabled?: boolean,
    classList?: string,
    isRound?: boolean,
    fGrow?: boolean,
    to?: string,
    color?: 'yellow' | 'red' | 'green' | 'purple' | "",
}

const Button: FC<Props> = (props: Props) => {
    const classnames = [
        getClR(props.classList),
        getCl(true, props.type),
        getCl(props.disabled, 'disabled'),
        getCl(!!props.color, props.color),
        getCl(!props.children, 'icon'),
        getCl(props.loading, 'loading'),
        getCl(props.fGrow, 'fGrow'),
        getCl((!props.children && !!props.icon), 'asIcon'),
    ].join(' ')

    if (props.to) {
        return (
            <NavLink to={props.to} className={`btn ${classnames}`} onClick={props.onClick}>
                {props.icon &&
                    <Icon name={props.icon} />
                }
                {props.children}
            </NavLink>
        )
    } else {
        return (
            <button className={`btn ${classnames}`} onClick={props.onClick}>
                {props.icon &&
                    <Icon name={props.icon} />
                }
                {props.children}
            </button>
        )
    }
}

export default Button;