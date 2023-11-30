import { FC, ReactNode, useEffect, useState } from "react";
import './styles.scss';
import { _SITE_URL, logOut, setRequest } from "../../API";
import Icon from "../../ui/icon/icon";
import Button from "../../ui/button/button";

interface Props {
}

export interface IImage {

    image: string,
    url: string,
    extension: string,
    info: {
        size: number,
        lastModified: string
    }

}

const MediaItem: FC<IImage> = (props: IImage) => {
    const ext = props.extension.toLowerCase().trim().replace('.', '');
    const isImage = ext === 'png' || ext === 'jpg' || ext === 'jpeg';
    const isVideo = ext === 'mp4' || ext === 'mpeg';
    const size = Math.round(props.info.size / 1024)

    const getSize = () => {
        let str = "Кб"
        let _size: any = size;
        if (size > 1024) {
            _size = (size / 1024).toFixed(2)
            str = "Мб"
        }

        return _size.toLocaleString() + " " + str;
    }

    const deleteMedia = () => {
        setRequest({
            url: '/media/' + props.image + "?delete=true",
            type: "GET",
            success: (res) => {
                
                console.log('update', res)
            }
        })
    }

    return (
        <div className="mediaItem">
            <div className="mediaItem__remove">
                <Button type="primary" color="red" icon="trash" onClick={deleteMedia} />
            </div>
            <div className="mediaItem__file">
                {isImage &&
                    <img src={_SITE_URL + props.url} />
                }
                {isVideo &&
                    <video src={_SITE_URL + props.url} autoPlay={true} muted={true} loop={true} />
                }
                {!isImage && !isVideo &&
                    <>cap</>
                }
            </div>
            <div className="mediaItem__info">
                <div className="mediaItem__name">
                    {props.image}
                </div>
                <div className="mediaItem__size">
                    {getSize()}
                </div>
            </div>
        </div>
    )
}

export default MediaItem;