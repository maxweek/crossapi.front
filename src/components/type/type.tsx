import { FC, ReactNode, useEffect, useRef, useState } from "react";
import './styles.scss';
import { _SITE_URL } from "../../API";
import { IType } from "../../store/store";
import { getCl } from "../../helper";


interface TypeListProps {
    children: ReactNode
}
interface TypeProps extends IType {
    onClick: () => void;
}

export const TypeList: FC<TypeListProps> = (props: TypeListProps) => {
    return (
        <div className="typeList">
            {props.children}
        </div>
    )
}

const Type: FC<TypeProps> = (props: TypeProps) => {
    const classlist = [
        getCl(props.onClick !== undefined, 'interactive')
    ].join('')
    return (
        <div className={`type ${classlist}`} style={{ borderColor: props.color }} onClick={props.onClick}>
            <div className="type__box">
                <div className="type__icon" style={{ borderColor: props.color }}>
                    {props.name}
                </div>
                <div className="type__title">
                    {props.name}
                </div>
            </div>
            {props.description &&
                <div className="type__description">{props.description}</div>
            }
        </div>
    )
}

export default Type;