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
    items: IGalleryImage[]
    setItems: (items: IGalleryImage[]) => void
}

const pointer = {
    isDragging: false as boolean,
    x: 0,
    y: 0,
    oldX: 0,
    oldY: 0,
    prevX: 0,
    prevY: 0,
    distanceX: 0,
    distanceY: 0,
    currentPlaceId: null as number | null,
    eTarget: {} as Element | null,
    itemRef: {} as HTMLDivElement,
    placeRef: null as Element | null,
    oldPlaceRef: null as Element | null,
    itemRect: {} as DOMRect,
    galleryRect: {} as DOMRect,
    onPlace: false,
    placeId: null as number | null,
    htmlElement: document.querySelector('html'),
    calculatedRect: {
        top: 0,
        left: 0,
    }
}

const Gallery: FC<Props> = observer((props: Props) => {
    const [items, setItems] = useState<IGalleryImage[]>([])
    const galleryRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const reader = new FileReader();

    useEffect(() => {
        let items = [...props.items]
        items.sort((a, b) => a.sort - b.sort);
        setItems(items)
        console.log("UPDATES ITEMS")
        // makeDefaultOldPlaceImage(false)
    }, [props.items])

    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', onPointerUp)
        return () => {
            window.removeEventListener('pointermove', onPointerMove)
            window.removeEventListener('pointerup', onPointerUp)
        }
    }, [items])

    const changeSort = (oldId: number, newId: number) => {
        let array = [...items];
        const oldIndex = array.findIndex(item => item.id === oldId);
        const newIndex = array.findIndex(item => item.id === newId);

        if (oldIndex !== -1 && newIndex !== -1) {
            const tempSort = array[oldIndex].sort;
            array[oldIndex].sort = array[newIndex].sort;
            array[newIndex].sort = tempSort;
        }
        console.log(array, 'array')
        props.setItems(array)
    }

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

    function onPointerMove(e: PointerEvent) {
        if (!pointer.isDragging) return

        pointer.x = e.clientX
        pointer.y = e.clientY

        pointer.distanceX = pointer.x - pointer.oldX
        pointer.distanceY = pointer.y - pointer.oldY

        pointer.itemRef.style.translate = `${pointer.distanceX}px ${pointer.distanceY}px`;
        pointer.eTarget = document.elementFromPoint(e.clientX - pointer.prevX, e.clientY - pointer.prevY)

        pointer.itemRef.classList.add('__dragging')
        pointer.itemRef.classList.add('__zIndex')
        galleryRef.current?.classList.add('__dragActive')

        if (pointer.eTarget !== null) {
            if (pointer.eTarget.classList.contains('gallery__item')) {
                let target = pointer.eTarget
                pointer.placeRef = target
                pointer.placeId = parseInt(target?.getAttribute('data-id') as string);
                if (pointer.currentPlaceId !== pointer.placeId && target) {
                    let item: HTMLDivElement = target?.querySelector('.gallery__item_image') as HTMLDivElement
                    if (item && target) {
                        let rect = target.getBoundingClientRect()
                        let left = pointer.galleryRect.left - pointer.calculatedRect.left - rect.left
                        let top = pointer.galleryRect.top - pointer.calculatedRect.top - rect.top
                        item.style.translate = `${left}px ${top}px`
                        // console.log(left, pointer.galleryRect.left, pointer.calculatedRect.left, rect.left)
                    }
                }
            } else {
                makeDefaultOldPlaceImage(true)
                pointer.placeRef = null;
                pointer.placeId = null;
            }
        } else {
        }
        // console.log(pointer.placeId, pointer.eTarget?.closest('.gallery__item')?.classList.contains('gallery__item'))
    }

    function makeDefaultOldPlaceImage(needTransition: boolean) {
        let selector = '.gallery__item:not([data-id="' + pointer.currentPlaceId + '"]) .gallery__item_image'
        // console.log("TEST", selector)
        let items: NodeListOf<HTMLDivElement> | undefined = galleryRef.current?.querySelectorAll(selector);
        if (needTransition) {
            items?.forEach(item => {
                item.style.translate = `0 0`
            })
        } else {
            galleryRef.current?.classList.add('__calc')
            items?.forEach(item => {
                item.style.translate = `0 0`
            })
            setTimeout(() => {
            }, 10)
            setTimeout(() => {
                galleryRef.current?.classList.remove('__calc')
            }, 2000)
        }
    }

    function onPointerUp(e: PointerEvent) {
        if (pointer.htmlElement) pointer.htmlElement.style.cursor = 'unset'
        pointer.isDragging = false;
        pointer.itemRef?.classList?.remove('__dragging')
        galleryRef.current?.classList.remove('__dragActive')
        if (pointer.placeId !== null && pointer.placeId !== pointer.currentPlaceId) {
            let placeRect = pointer.placeRef?.getBoundingClientRect();
            if (placeRect) {
                let left = placeRect.left - pointer.galleryRect.left + pointer.calculatedRect.left
                let top = placeRect.top - pointer.galleryRect.top + pointer.calculatedRect.top

                pointer.itemRef.style.translate = `${left}px ${top}px `;
                console.log(pointer.galleryRect, pointer.calculatedRect, placeRect, left)
                let placeId = pointer.placeId
                let currentId = pointer.currentPlaceId
                setTimeout(() => {
                    changeSort(currentId as number, placeId)
                }, 200)
            }
        } else {
            if (pointer.itemRef.style) {
                pointer.itemRef.style.translate = `0 0 `;
            }
        }
        setTimeout(() => {
            pointer.itemRef.classList?.remove('__zIndex')
        }, 200)

        pointer.currentPlaceId = null;
        pointer.placeId = null
    }

    function onPointerDown(e: React.PointerEvent<HTMLDivElement>, id: number, ref: HTMLDivElement) {
        if (pointer.htmlElement) pointer.htmlElement.style.cursor = 'grabbing'
        pointer.isDragging = true;
        pointer.itemRef = ref;
        pointer.currentPlaceId = id
        pointer.oldX = e.clientX
        pointer.oldY = e.clientY

        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const parent = el.closest('.gallery__item');
        if (rect) {
            pointer.itemRect = rect
            pointer.prevX = pointer.oldX - rect.left - rect.width / 2;
            pointer.prevY = pointer.oldY - rect.top - rect.height / 2;
        }
        if (galleryRef.current && parent) {
            const parentRect = parent.getBoundingClientRect()
            const galleryRect = galleryRef.current.getBoundingClientRect()
            pointer.galleryRect = galleryRect
            pointer.calculatedRect.top = galleryRect.top - parentRect.top
            pointer.calculatedRect.left = galleryRect.left - parentRect.left
            // pointer.galleryRef = galleryRef.current 
        }
    }

    return (
        <div className={`gallery`} ref={galleryRef}>
            <div className={`gallery__list`} ref={galleryRef}>
                {items.map((item, i) => <GalleryItem item={item} order={i} onPointerDown={onPointerDown} deleteImage={deleteImage} />)}
                <GalleryItem add={true} onAddClick={() => { inputRef.current?.click() }} />
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
    order?: number
}

const GalleryItem: FC<IGalleryItemProps> = (props: IGalleryItemProps) => {
    const refImage = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (refImage.current) {
            refImage.current.classList.remove('__deleting')
            refImage.current.style.transition = 'translate 0s, opacity .1s'
            refImage.current.style.translate = `0 0`
            refImage.current.style.opacity = `0`
            setTimeout(() => {
                if (refImage.current) {
                    refImage.current.style.transition = ''
                    refImage.current.style.opacity = ``
                }
            }, 100)
        }
    }, [props.item])
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        console.log('down')
        if (typeof props.onPointerDown === 'function' && props.item?.id && refImage.current) {
            props.onPointerDown(e, props.item?.id, refImage.current)
        }
    }
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
    return (
        <div className={`gallery__item ${getCl(props.add, 'add')}`}
            data-id={props.item?.id}
            data-sort={props.item?.sort}
            data-order={props.order}
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
                        onPointerDown={onPointerDown}
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

export default Gallery;