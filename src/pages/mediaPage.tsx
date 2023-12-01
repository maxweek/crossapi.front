import { ChangeEvent, FC, useEffect, useState } from "react";
import Page, { PageBody, PageHead } from "../ui/page/page";
import Table from "../ui/table/table";
import AppStore from "../store/store";
import Tile from "../components/tile/tile";
import GallerySimple, { IGalleryImage } from "../components/gallery/gallerySimple";
import { _SITE_URL, setRequest } from "../API";
import { IImage } from "../components/mediaItem/Item";
import MediaItemList from "../components/mediaItem/list";
import Button from "../ui/button/button";
import Modal from "../ui/modal/modal";
import FileUpload from "../components/mediaItem/uploadFiles";

interface Props {

}


const MediaPage: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IImage[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [addModalActive, setAddModalActive] = useState<boolean>(false);

    useEffect(() => {
        // setLoaded(false)
        setRequest({
            type: "GET",
            url: '/media/',
            success: res => {
                console.log(res, 'MEDIA')
                setItems(res)
                // setLoaded(true)
            }
        })
    }, [])

    return (
        <Page>
            <PageHead
                title={"Медиа"}
                info="/media"
                actions={<>
                    <Button type="primary" icon="plus" onClick={() => { setAddModalActive(true) }}>Добавить</Button>
                </>}
            />
            <PageBody>
                <MediaItemList items={items} />
                <Modal title="Добавить медиа" isActive={addModalActive} setActive={setAddModalActive}>
                    <FileUpload url="/media" />
                </Modal>
            </PageBody>
        </Page>
    )
}

export default MediaPage
