import { observer } from "mobx-react-lite";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableStore from "../../store/table";
import { setRequest } from "../../API";
import Page, { PageBody, PageHead } from "../../ui/page/page";
import Form, { FormActions, FormBody, FormCol, FormRow } from "../../ui/form/form";
import Input from "../../ui/input/input";
import Button from "../../ui/button/button";
import { v4 as uuidv4 } from "uuid";

interface Props {

}

const Table_Add_Page: FC<Props> = observer((props: Props) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setRequest({
            type: 'GET',
            url: `/core/tables/${id}`,
            success: res => {
                setLoaded(true);
                // console.log(res)
                // loadTable(res.name);
                TableStore.setTable(res);
                TableStore.setEditItem(undefined)
            }
        })
    }, [id])


    const onSubmit = () => {
        setLoaded(false)
        setRequest({
            type: 'POST',
            url: `/api/${TableStore.table.name}/`,
            data: TableStore.editItem.data,
            success: res => {
                setLoaded(true);
                setTimeout(() => {
                    navigate(`/tables/table/${id}/`)
                }, 200)
            }
        })
    }

    return (
        <Page className="dashboard">
            <PageHead
                title={"Добавить элемент"}
                info={TableStore.table.name}
            />
            <PageBody>
                <Form asModule={false}>
                    <FormBody>
                        {TableStore.editItem?.fields?.map(field => {
                            return (
                                <FormRow>
                                    <FormCol>
                                        {field.type.name}
                                        {field.type.name === 'text' &&
                                            <Input
                                                type={"text"}
                                                label={field.name}
                                                value={field.value}
                                                onChange={value => TableStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                        {field.type.name === 'number' &&
                                            <Input
                                                type={"number"}
                                                label={field.name}
                                                value={field.value}
                                                onChange={value => TableStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                        {field.type.name === 'boolean' &&
                                            <Input
                                                type={"checkbox"}
                                                label={field.name}
                                                value={field.value}
                                                onChange={value => TableStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                        {field.type.name === 'json' &&
                                            <Input
                                                type={"textarea"}
                                                label={field.name}
                                                value={field.value}
                                                onChange={value => TableStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                        {field.type.name === 'date' &&
                                            <Input
                                                type={"datetime"}
                                                label={field.name}
                                                value={field.value}
                                                onChange={value => TableStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                        {field.type.name === 'uuid' &&
                                            <FormCol asRow={true}>
                                                <Input
                                                    type={"text"}
                                                    disabled={true}
                                                    label={field.name}
                                                    value={field.value}
                                                    onChange={value => TableStore.setEditItemValue(field.name, value)}
                                                />
                                                <Button type="primary" icon="refresh-cw" onClick={() => TableStore.setEditItemValue(field.name, uuidv4())} />
                                            </FormCol>
                                        }
                                        {field.type.name === 'list' &&
                                            <Input
                                                type={"select"}
                                                label={field.name}
                                                value={field.value}
                                                options={field.options}
                                                onChange={value => TableStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                        {field.type.name === 'multilist' &&
                                            <Input
                                                type={"multiselect"}
                                                label={field.name}
                                                value={field.value}
                                                options={field.options}
                                                onChange={value => TableStore.setEditItemValue(field.name, value)}
                                            />
                                        }
                                    </FormCol>
                                </FormRow>
                            )
                        })}
                    </FormBody>
                    <FormActions>
                        <Button type="primary" onClick={onSubmit} icon="check" loading={!loaded}>Применить</Button>
                        <Button type="secondary" onClick={() => navigate(`/tables/table/${id}/`)}>Отменить</Button>
                    </FormActions>
                </Form>
            </PageBody>
        </Page >
    )
})

export default Table_Add_Page