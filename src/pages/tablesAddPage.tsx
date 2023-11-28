import { ChangeEvent, FC, useEffect, useState } from "react";
import Page, { PageBody, PageHead, PageInDev } from "../ui/page/page";
import { _SITE_URL, apiRequest, setRequest } from "../API";
import Table from "../ui/table/table";
import AppStore from "../store/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router";
import Button from "../ui/button/button";
import Form, { FormActions, FormBody, FormCol, FormRow } from "../ui/form/form";
import Input from "../ui/input/input";
import InputText from "../ui/input/inputText";
import TableStore from "../store/table";
import Modal from "../ui/modal/modal";
import Type, { TypeList } from "../components/type/type";

interface Props {

}

const Tables_Add_Page: FC<Props> = observer((props: Props) => {
    const [loaded, setLoaded] = useState<boolean>(true);
    const [modalActive, setModalActive] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        TableStore.setEditTable(undefined)
    }, [])

    const onSubmit = () => {
        setLoaded(false)
        setRequest({
            type: 'POST',
            url: `/core/tables/add/`,
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
                title={"Добавить таблицу"}
                // info={TableStore.table.name}
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
                        
                        {TableStore.editTable?.fields?.map(field => {
                            return (
                                <FormRow>
                                    <FormCol>
                                        <Input
                                            type={"text"}
                                            label={field.type.name}
                                            value={field.name}
                                            onChange={value => TableStore.setEditTableValue(field.name, value)}
                                        />
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
        </Page >
    )
})

export default Tables_Add_Page