import { FC, ReactNode, useEffect, useRef, useState } from "react";
import './styles.scss';
import { getCl, getClR } from "../../helper";
import Image from "../../ui/image/image";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "../../ui/icon/icon";
import AppStore, { IUser } from "../../store/store";
import { _SITE_URL } from "../../API";

interface Props {
    user: IUser
    small?: boolean
}

const User: FC<Props> = (props: Props) => {
    return (
        <div className={`user `}>
            <div className="user__image">
                <Image src={props.user.image || 'ref__avatar_default.svg'} />
            </div>
            {!props.small &&
                <div className="user__info">
                    <div className="user__name">
                        {props.user.name} {props.user.surname}
                    </div>
                    <div className="user__post">
                        {/* {AppStore.getPropertyByNameId('city', props.user.properties.city)?.title} */}
                        {/* {props.user.post} */}
                    </div>
                </div>
            }
        </div>
    )
}

export default User;