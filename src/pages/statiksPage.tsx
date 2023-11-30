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