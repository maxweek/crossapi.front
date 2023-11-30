import { ChangeEvent, FC, useEffect, useState } from "react";
import Page, { PageBody, PageHead, PageInDev } from "../ui/page/page";
import { _SITE_URL, apiRequest, setRequest } from "../API";
import AppStore from "../store/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router";
import Button from "../ui/button/button";
import Form, { FormActions, FormBody, FormCol, FormRow } from "../ui/form/form";
import Input from "../ui/input/input";
import InputText from "../ui/input/inputText";
import StatikStore from "../store/statik";
import Modal from "../ui/modal/modal";
import Type, { TypeList } from "../components/type/type";

interface Props {

}

const Statiks_Add_Page: FC<Props> = observer((props: Props) => {
    const [loaded, setLoaded] = useState<boolean>(true);
    const [modalActive, setModalActive] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        StatikStore.setEditItem(undefined)
    }, [])

    const onSubmit = () => {
        setLoaded(false)
        setRequest({
            type: 'POST',
            url: `/core/static/add/`,
            data: StatikStore.editItem,
            success: res => {
                setLoaded(true);
                setTimeout(() => {
                    navigate(`/static/`)
                }, 200)
            }
        })
    }

    return (
        <Page className="dashboard">
            <PageHead
                title={"Добавить таблицу"}
            // info={StatikStore.statik.name}
            />
            <PageBody>
                <Form asModule={false}>
                    <FormBody>
                        <FormRow>
                            <FormCol>
                                <Input
                                    type={"text"}
                                    label={"Имя таблицы"}
                                    value={StatikStore.editItem.name}
                                    onChange={value => StatikStore.setEditItemName(value)}
                                />
                            </FormCol>
                            <FormCol>
                                <Input
                                    type={"text"}
                                    label={"URL"}
                                    value={StatikStore.editItem.url}
                                    onChange={value => StatikStore.setEditItemUrl(value)}
                                />
                            </FormCol>
                        </FormRow>

                        {StatikStore.editItem?.fields?.map(field => {
                            return (
                                <FormRow>
                                    <FormCol>
                                        <Input
                                            type={"text"}
                                            label={field.type.name}
                                            value={field.name}
                                            onChange={value => StatikStore.setEditItemFieldName(field.name, value)}
                                        />
                                    </FormCol>
                                    <FormCol>

                                        {field.type.name === 'text' &&
                                            <Input
                                                type={"text"}
                                                label={field.name}
                                                value={field.value}
                                                onChange={value => StatikStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                        {field.type.name === 'number' &&
                                            <Input
                                                type={"number"}
                                                label={field.name}
                                                value={field.value}
                                                onChange={value => StatikStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                        {field.type.name === 'boolean' &&
                                            <Input
                                                type={"checkbox"}
                                                label={field.name}
                                                value={field.value}
                                                onChange={value => StatikStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                    </FormCol>
                                </FormRow>
                            )
                        })}
                        <Button type="primary" onClick={() => setModalActive(true)}>Добавить поле</Button>
                    </FormBody>
                    <FormActions>
                        <Button type="primary" onClick={onSubmit} icon="check" loading={!loaded}>Применить</Button>
                        <Button type="secondary" onClick={() => navigate(`/statiks/`)}>Отменить</Button>
                    </FormActions>
                </Form>
            </PageBody>
            <Modal isActive={modalActive} setActive={setModalActive} title="Выбрать тип">
                <TypeList>
                    {AppStore.types.map((type, k) => (
                        <Type {...type} key={k} onClick={() => {
                            setModalActive(false)
                            StatikStore.addEditItemField(type)
                        }} />
                    ))}
                </TypeList>
            </Modal>
        </Page >
    )
})

export default Statiks_Add_Page