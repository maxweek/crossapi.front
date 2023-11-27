import { ChangeEvent, FC, useEffect, useState } from "react";
import Page, { PageBody, PageHead, PageInDev } from "../ui/page/page";
import { _SITE_URL, apiRequest, setRequest } from "../API";
import Table from "../ui/table/table";
import AppStore from "../store/store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";
import Button from "../ui/button/button";
import { Link } from "react-router-dom";
import TableStore from "../store/table";

interface Props {

}

const Table_Page: FC<Props> = observer((props: Props) => {
    const { id } = useParams();

    useEffect(() => {
        load();
    }, [id])


    const load = () => {
        setRequest({
            type: 'GET',
            url: `/core/tables/${id}`,
            success: res => {
                // console.log(res)
                TableStore.setTable(res)
                loadTable(res.name);
            }
        })
    }

    const loadTable = (name: string) => {
        setRequest({
            type: "GET",
            url: `/api/${name}/`,
            success: res => {
                TableStore.setItems(res)
            }
        })
    }

    const deleteItem = (id: number) => {
        setRequest({
            type: "POST",
            url: `/api/${TableStore.table.name}/${id}/delete/`,
            success: res => {
                load();
                // console.log(res)
            }
        })
    }

    return (
        <Page className="dashboard">
            <PageHead
                title={TableStore.table.name}
                info={"#" + id}
                actions={<>
                    <Button type="primary" to="add" icon="plus">Добавить</Button>
                </>}
            />
            <PageBody>
                <Table
                    thead={[
                        {
                            title: 'id'
                        },
                        {
                            title: 'name'
                        },
                        {
                            title: 'updatedAt'
                        },
                        {
                            title: 'createdAt'
                        },
                        {
                            title: '',
                            width: '2%'
                        },
                    ]}
                    tbody={TableStore.items.map(item => [
                        `${item.id}`,
                        <Link to={`/tables/table/${id}/${item.id}/`}>{item.title}</Link>,
                        `${new Date(item.updatedAt).toLocaleString()}`,
                        `${new Date(item.createdAt).toLocaleString()}`,
                        <Button type="primary" color="red" icon="trash" onClick={() => { deleteItem(item.id) }} />,
                    ])}
                />
            </PageBody>
        </Page >
    )
})

export default Table_Page