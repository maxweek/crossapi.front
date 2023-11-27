import { FC, ReactNode, useEffect, useRef, useState } from "react";
import './styles.scss';
import { getCl } from "../../helper";
import Image from "../../ui/image/image";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "../../ui/icon/icon";
import AppStore from "../../store/store";
import User from "../user/user";
import { observer } from "mobx-react-lite";
import { logOut } from "../../API";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import YMap from "./map";

interface IAdress {
    longitude: number | null,
    latitude: number | null,
    address: string
}

interface Props {
    setAddress: (obj: IAdress) => void,
    coords: IAdress,
    setMapLoad?: (type: boolean) => void
}

const YandexMap: FC<Props> = observer((props: Props) => {
    return (
        <div className={`map`}>
            <YMap
                // @ts-ignore
                coords={props.coords} setAddress={props.setAddress} setLoad={props.setMapLoad}
            />
        </div>
    )
})

export default YandexMap;