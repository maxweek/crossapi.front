import { observer } from "mobx-react-lite";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TableStore from "../../store/table";
import { _SITE_URL, setRequest } from "../../API";
import Page, { PageBody, PageHead } from "../../ui/page/page";
import Form, { FormActions, FormBody, FormCol, FormRow } from "../../ui/form/form";
import Input from "../../ui/input/input";
import Button from "../../ui/button/button";
import Modal from "../../ui/modal/modal";
import Type, { TypeList } from "../../components/type/type";
import AppStore from "../../store/store";
import Table from "../../ui/table/table";

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

    const tableFields = TableStore.table.fields?.map(field => {
        return { title: field.name }
    }) ?? []

    return (
        <Page className="dashboard">
            <PageHead
                title={TableStore.table.name}
                info={`#${id} - ${_SITE_URL}/api/${TableStore.table.name}/`}
                actions={<>
                    <Button type="primary" to="add" icon="plus">Добавить</Button>
                </>}
            />
            <PageBody>
                <Table
                    thead={[
                        {
                            title: 'id',
                        },
                        ...tableFields,
                        {
                            title: 'createdAt',
                        },
                        {
                            title: 'updatedAt',
                        },
                        {
                            title: '',
                            width: '2%'
                        },
                    ]}
                    tbody={TableStore.items.map(item => {
                        let fields: string[] = []
                        tableFields.map(f => {
                            //@ts-ignore
                            fields.push(`${item[f.title]}`)
                        })
                        return [
                            <Link to={`/tables/table/${id}/${item.id}/`}>{item.id}</Link>,
                            ...fields,
                            `${new Date(item.updatedAt).toLocaleString()}`,
                            `${new Date(item.createdAt).toLocaleString()}`,
                            <Button type="primary" color="red" icon="trash" onClick={() => { deleteItem(item.id) }} />,
                        ]
                    })}
                />
            </PageBody>
        </Page >
    )
})

export default Table_Page