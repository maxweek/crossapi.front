import { ChangeEvent, FC, useEffect, useState } from "react";
import Page, { PageBody, PageHead, PageInDev } from "../ui/page/page";
import { _SITE_URL, apiRequest, setRequest } from "../API";
import Table from "../ui/table/table";
import AppStore from "../store/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router";
import Button from "../ui/button/button";
import Form, { FormActions, FormBody, FormCol, FormHr, FormRow } from "../ui/form/form";
import Input from "../ui/input/input";
import InputText from "../ui/input/inputText";
import TableStore from "../store/table";
import Modal from "../ui/modal/modal";
import Type, { TypeList } from "../components/type/type";
import Tile from "../components/tile/tile";

interface Props {

}

const Tables_Edit_Page: FC<Props> = observer((props: Props) => {
    const [loaded, setLoaded] = useState<boolean>(true);
    const [modalActive, setModalActive] = useState<boolean>(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        load()
    }, [])

    const load = () => {
        setRequest({
            type: "GET",
            url: `/core/tables/${id}/`,
            success: res => {
                TableStore.setEditTable(id, res)
            }
        })
    }

    const onSubmit = () => {
        setLoaded(false)
        setRequest({
            type: 'POST',
            url: `/core/tables/${id}/`,
            data: TableStore.editTable,
            success: res => {
                setLoaded(true);
                setTimeout(() => {
                    navigate(`/tables/`)
                }, 200)
            }
        })
    }

    return (
        <Page className="dashboard">
            <PageHead
                title={"Изменить таблицу"}
                info={TableStore.table.name}
            />
            <PageBody>
                <Form asModule={false}>
                    <FormBody>
                        <FormRow>
                            <FormCol>
                                <Input
                                    type={"text"}
                                    label={"Имя таблицы"}
                                    value={TableStore.editTable.name}
                                    onChange={value => TableStore.setEditTableName(value)}
                                />
                            </FormCol>
                        </FormRow>
                        <FormHr />
                        <PageHead
                            title={"Поля"}
                        />
                        {TableStore.editTable?.fields?.map((field, i) => {
                            return (
                                <FormRow>
                                    <FormCol asRow={true}>
                                        <Input
                                            type={"text"}
                                            label={field.type.name}
                                            value={field.name}
                                            onChange={value => TableStore.setEditTableValue(field.name, value)}
                                        />
                                        <Button type="primary" color="red" icon="trash" onClick={() => { TableStore.removeEditTableFieldByIndex(i) }} />
                                    </FormCol>
                                </FormRow>
                            )
                        })}
                        <Button type="primary" onClick={() => setModalActive(true)}>Добавить поле</Button>
                    </FormBody>
                    <FormActions>
                        <Button type="primary" onClick={onSubmit} icon="check" loading={!loaded}>Применить</Button>
                        <Button type="secondary" onClick={() => navigate(`/tables/`)}>Отменить</Button>
                    </FormActions>
                </Form>
            </PageBody>
            <Modal isActive={modalActive} setActive={setModalActive} title="Выбрать тип">
                <TypeList>
                    {AppStore.types.map((type, k) => (
                        <Type {...type} key={k} onClick={() => {
                            setModalActive(false)
                            TableStore.addEditTableField(type)
                        }} />
                    ))}
                </TypeList>
            </Modal>
        </Page>
    )
})

export default Tables_Edit_Page