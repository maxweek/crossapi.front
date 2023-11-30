import { observer } from "mobx-react-lite";
import { ChangeEvent, FC, useEffect, useState } from "react";
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

const Statiks_Page: FC<Props> = observer((props: Props) => {
    const navigate = useNavigate()


    useEffect(() => {
        load()
    }, [])

    const load = () => {
        setRequest({
            type: 'GET',
            url: '/core/static/',
            success: (res) => {
                AppStore.setStatiks(res)
            },
        })
    }

    const deleteTable = (id: number | null) => {
        setRequest({
            type: 'POST',
            url: `/core/static/${id}/delete`,
            success: (res) => {
                load()
            },
        })
    }

    return (
        <Page className="dashboard">
            <PageHead
                title={"Статика"}
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
                            title: 'url'
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
                    tbody={AppStore.statiks.map(statik => [
                        `${statik.id}`,
                        <Link to={`/static/${statik.id}/`}>{statik.name}</Link>,
                        `/static/${statik.url}/`,
                        <span dangerouslySetInnerHTML={getRawHtml(TableStore.getFieldsHyper(statik.fields))} />,
                        `${statik.updatedAt}`,
                        <Button type="primary" color="red" onClick={() => deleteTable(statik.id)} icon="trash" />
                    ])}
                />
            </PageBody>
        </Page >
    )
})

export default Statiks_Page