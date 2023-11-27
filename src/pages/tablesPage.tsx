import { ChangeEvent, FC, useEffect, useState } from "react";
import Page, { PageBody, PageHead, PageInDev } from "../ui/page/page";
import { _SITE_URL, apiRequest, setRequest } from "../API";
import Table from "../ui/table/table";
import AppStore from "../store/store";
import { observer } from "mobx-react-lite";
import Button from "../ui/button/button";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import TableStore from "../store/table";
import { getRawHtml } from "../helper";
interface Props {

}

const Tables_Page: FC<Props> = observer((props: Props) => {
    const navigate = useNavigate()


    useEffect(() => {
        load()
    }, [])

    const load = () => {
        setRequest({
            type: 'GET',
            url: '/core/tables',
            success: (res) => {
                AppStore.setTables(res)
            },
        })
    }

    const deleteTable = (id: number) => {
        setRequest({
            type: 'POST',
            url: `/core/tables/${id}/delete`,
            success: (res) => {
                load()
            },
        })
    }

    return (
        <Page className="dashboard">
            <PageHead
                title={"Таблицы"}
                actions={<>
                    <Button type="primary" icon="plus" onClick={() => { navigate('add/') }}>Добавить</Button>
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
                            title: 'fields'
                        },
                        {
                            title: 'Обновлено'
                        },
                        {
                            title: '',
                            width: '2%'
                        },
                    ]}
                    tbody={AppStore.tables.map(table => [
                        `${table.id}`,
                        <Link to={`/tables/${table.id}/`}>{table.name}</Link>,
                        <span dangerouslySetInnerHTML={getRawHtml(TableStore.getFieldsHyper(table.fields))} />,
                        `${table.updatedAt}`,
                        <Button type="primary" color="red" onClick={() => deleteTable(table.id)} icon="trash" />
                    ])}
                />
            </PageBody>
        </Page >
    )
})

export default Tables_Page