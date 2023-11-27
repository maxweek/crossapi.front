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

const YMap = observer((props) => {
    const [coords, setCoords] = useState([55.751574, 37.573856]);
    const [defaultCoords, setDefaultCoords] = useState([55.751574, 37.573856]);
    const ref = useRef(null)
    const mapRef = useRef(null)

    useEffect(() => {
        setCoords([props.coords.latitude, props.coords.longitude])
    }, [props.coords])
    console.log(coords)

    const getCoords = e => {
        props.setLoad(false)
        let coords = e.get('coords')
        setCoords(coords)

        ref.current.geocode(coords).then(res => {
            let firstGeoObject = res.geoObjects.get(0);
            let address = firstGeoObject.getAddressLine()
            if (typeof props.setLoad === 'function') {
                props.setLoad(true)
            }
            if (typeof props.setAddress === 'function') {
                let obj = {
                    latitude: coords[0],
                    longitude: coords[1],
                    address: address
                }
                console.log('TEST', obj)
                props.setAddress(obj)
            }
        })
    };
    const onLoad = (e) => {
        ref.current = e
        setTimeout(() => {
            if (!props.coords.latitude) {
                let city = AppStore.getPropertyByNameId('city', AppStore.user.properties.city)?.title
                if (city) {
                    ref.current.geocode(city).then(res => {
                        let firstGeoObject = res.geoObjects.get(0);
                        let coords = firstGeoObject.geometry.getCoordinates()
                        // setDefaultCoords(coords)
                        setCoords(coords)
                        // setDefaultCoords(coords)
                        console.log(ref.current)
                        // ref.current.
                        if(mapRef.current){
                            mapRef.current.setCenter(coords)
                        }
                    });
                }
            }
            if (typeof props.setLoad === 'function') {
                props.setLoad(true)
            }
        }, 1000)
    }
    return (
        <YMaps query={{
            apikey: '215543d1-f089-48cb-aa9a-bfa5cae0dda4',
        }}

        >
            <Map
                width={'100%'}
                height={'100%'}
                modules={["geolocation", "geocode"]}
                onClick={e => getCoords(e)}
                onLoad={onLoad}
                instanceRef={mapRef}
                // state={{
                    
                    // center: defaultCoords,
                //     zoom: 9,
                // }}
                defaultState={{
                    center: coords,
                    zoom: 9,
                    controls: []
                }}
            >
                <Placemark
                    geometry={{
                        type: 'Point',
                        coordinates: coords,
                    }}
                    options={{
                        preset: 'islands#blackStretchyIcon',
                    }}
                />
            </Map>
        </YMaps>
    )
})

export default YMap;