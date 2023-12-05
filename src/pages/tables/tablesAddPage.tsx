import { observer } from "mobx-react-lite";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableStore from "../../store/table";
import { setRequest } from "../../API";
import Page, { PageBody, PageHead } from "../../ui/page/page";
import Form, { FormActions, FormBody, FormCol, FormHr, FormRow } from "../../ui/form/form";
import Input from "../../ui/input/input";
import Button from "../../ui/button/button";
import Modal from "../../ui/modal/modal";
import Type, { TypeList } from "../../components/type/type";
import AppStore from "../../store/store";

interface Props {

}

const Tables_Add_Page: FC<Props> = observer((props: Props) => {
    const [loaded, setLoaded] = useState<boolean>(true);
    const [modalActive, setModalActive] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // TableStore.setEditTable(undefined)
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
                    console.log(JSON.parse(JSON.stringify(TableStore.editItem)))
                    debugger
                    // navigate(`/tables/`)
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
                                    label={"Имя таблицы на англ"}
                                    value={TableStore.editTable.name}
                                    onChange={value => TableStore.setEditTableName(value)}
                                />
                            </FormCol>
                            <FormCol>
                                <Input
                                    type={"text"}
                                    label={"Публичное имя таблицы"}
                                    value={TableStore.editTable.publicName}
                                    onChange={value => TableStore.setEditTablePublicName(value)}
                                />
                            </FormCol>
                            <FormCol>
                                <Input
                                    type={"checkbox"}
                                    label={"Активность"}
                                    value={TableStore.editTable.active}
                                    onChange={value => TableStore.setEditTableActive(value)}
                                />
                            </FormCol>
                        </FormRow>
                        <FormHr />
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
                                    {(field.type.name === 'list' || field.type.name === 'multilist') &&
                                        <FormCol>
                                            <FormCol asRow={true}>
                                                {field.options?.map((option, index) => {
                                                    return (
                                                        <>
                                                            <Input
                                                                type={"text"}
                                                                label={option.id.toString()}
                                                                value={option.title}
                                                                onChange={value => TableStore.setEditTableOption(field.name, index, value)}
                                                            />
                                                            <Button type="primary" color="red" icon="trash" onClick={() => { TableStore.setEditTableOptionRemove(field.name, index) }} />
                                                        </>
                                                    )
                                                })}
                                            </FormCol>
                                            <Button type="primary" onClick={() => TableStore.setEditTableOptionAdd(field.name)}>Добавить вариант</Button>
                                        </FormCol>
                                    }
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