import { ChangeEvent, FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import TableStore from "../../store/table";
import { setRequest } from "../../API";
import Page, { PageBody, PageHead } from "../../ui/page/page";
import Form, { FormActions, FormBody, FormCol, FormRow } from "../../ui/form/form";
import Input from "../../ui/input/input";
import Button from "../../ui/button/button";
import Modal from "../../ui/modal/modal";
import Type, { TypeList } from "../../components/type/type";
import AppStore from "../../store/store";
import Table from "../../ui/table/table";
import { getRawHtml } from "../../helper";


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