import { ChangeEvent, FC, ReactNode, useEffect, useRef, useState } from "react";
import './styles.scss';
import { observer } from "mobx-react-lite";
import Image from "../../ui/image/image";
import { getCl, isImageFile } from "../../helper";
import Icon from "../../ui/icon/icon";
import { InputFiles } from "typescript";
import NotifStore from "../../store/_notifStore";

export interface IGalleryImage {
    id: number,
    image: string,
    sort: number
}

interface Props {
    items: IGalleryImage[],
    max?: number,
    big?: boolean,
    setItems: (items: IGalleryImage[]) => void
}

const GallerySimple: FC<Props> = observer((props: Props) => {
    const [items, setItems] = useState<IGalleryImage[]>([])
    const galleryRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const reader = new FileReader();

    useEffect(() => {
        setItems(props.items)

    }, [props.items])

    const deleteImage = (id: number) => {
        let array = [...items].filter(el => el.id !== id);
        props.setItems(array)
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            let file = e.target.files[0]
            console.log(file)
            if (!file) return
            if (!isImageFile(file)) {
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                NotifStore.setWarning('Неверный формат файла')
                return
            }
            if (file.size / 1000 > 5000) {
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                NotifStore.setWarning('Превышен размер файла')
                return
            }
            let array = [...items];
            reader.readAsDataURL(e.target.files[0])
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    let sort = 0
                    let item = array[array.length - 1];
                    if (item) {
                        sort = item.sort + 1
                    }
                    array.push({
                        id: parseInt((Math.random() * 1000000).toFixed(0)),
                        image: reader.result,
                        sort
                    })
                    props.setItems(array)
                }
            }
        }
    }

    return (
        <div className={`gallerySimple ${getCl(props.big, 'big')}`} ref={galleryRef}>
            <div className={`gallery__list`} ref={galleryRef}>
                {items.map((item, i) => <GalleryItem item={item} deleteImage={deleteImage} />)}
                {(props.max === undefined || (items.length < props.max)) &&
                    <GalleryItem add={true} onAddClick={() => { inputRef.current?.click() }} />
                }
            </div>
            <input type="file" ref={inputRef} onChange={onInputChange}></input>
        </div>
    )
})

interface IGalleryItemProps {
    item?: IGalleryImage,
    onPointerDown?: (e: React.PointerEvent<HTMLDivElement>, id: number, ref: HTMLDivElement) => void,
    onAddClick?: () => void,
    deleteImage?: (id: number) => void,
    add?: boolean,
}

const GalleryItem: FC<IGalleryItemProps> = (props: IGalleryItemProps) => {
    const refImage = useRef<HTMLDivElement>(null)

    const onDelete = () => {
        if (typeof props.deleteImage === 'function' && props.item && refImage.current) {
            refImage.current.classList.add('__deleting')
            setTimeout(() => {
                if (typeof props.deleteImage === 'function' && props.item) {
                    props.deleteImage(props.item.id)
                }
            }, 200)
        }
    }

    useEffect(() => {
        if (props.item && refImage.current) {
            refImage.current.classList.remove('__deleting')
        }
    }, [props.item])

    return (
        <div className={`gallery__item ${getCl(props.add, 'add')}`}
        >
            {props.add &&
                <div className="gallery__item_add" onClick={props.onAddClick}>
                    <Icon name="plus" />
                    <div className="_title">Добавить фото</div>
                    <div className="_text">Не больше 5 мб<br />.png, .jpg, .tiff</div>
                </div>
            }
            {props.item?.image &&
                <>
                    <div className="gallery__item_image"
                        ref={refImage}
                    >
                        <div className="gallery__item_remove" onClick={onDelete}>
                            <Icon name="trash" />
                        </div>
                        <img src={props.item?.image} />
                        {/* <Image src={props.item?.image} /> */}
                    </div>
                </>
            }
        </div>
    )
}

export default GallerySimple;