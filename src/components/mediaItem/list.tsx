import { FC, ReactNode, useEffect, useState } from "react";
import './styles.scss';
import { observer } from "mobx-react-lite";
import MediaItem, { IImage } from "./Item";

interface Props {
    items: IImage[]
}

const MediaItemList: FC<Props> = observer((props: Props) => {
    return (
        <div className="mediaItemList">
            {props.items.map(item => <MediaItem {...item} />)}
        </div>
    )
})

export default MediaItemList;