import { ChangeEvent, FC, useState } from "react";
import Page from "../ui/page/page";
import API, { _IS_DEV, getToken, setRequest, setToken } from "../API";
import InputText from "../ui/input/input";
import Button from "../ui/button/button";
import Form, { FormActions, FormBody, FormFooter, FormHeader } from "../ui/form/form";
import AppStore from "../store/store";
import { setCookie } from "../helper";
import { observer } from "mobx-react-lite";
import Input from "../ui/input/input";
import Image from "../ui/image/image";

interface Props {

}

const LoginPage: FC<Props> = observer((props: Props) => {
    const [password, setPassword] = useState<string>(_IS_DEV ? 'Qwerty123' : '')
    const [loading, setLoading] = useState<boolean>(false)
    const [inputError, setInputError] = useState({
        login: '',
        password: '',
    })

    const onLoginChange = (value: any) => {
        AppStore.setUserEmail(value)
    }
    const onPassChange = (value: any) => {
        setPassword(value)
    }
    const handleClick = () => {
        setLoading(true)
        getToken({
            login: AppStore.getUserEmail(),
            password: password
        }, () => {
            setLoading(false)
            AppStore.setLogged(true)
        }, (err) => {
            setLoading(false)
            setInputError(err.error)
        })
    }
    return (
        <Page center={true} className={'auth'}>

            <Image src="logo.svg" />
            <Form asModule={true}>
                <FormHeader title="Вход" />
                <FormBody>
                    <Input
                        type="text"
                        label="E-mail"
                        value={AppStore.getUserEmail()}
                        onChange={onLoginChange}
                    />
                    <Input
                        type="text"
                        inputType="password"
                        label="Пароль"
                        value={password}
                        onChange={onPassChange}
                    />
                    {/* <InputText value={AppStore.getUserLogin()} error={inputError.login} label="email" onChange={onLoginChange} />
                    <InputText value={pass} error={inputError.password} label="password" onChange={onPassChange} /> */}
                </FormBody>
                <FormActions>
                    <Button type={"primary"} onClick={handleClick} loading={loading}>Вход</Button>
                    {/* <Button type={"secondary"} onClick={() => { AppStore.setLogged(true) }}>Забыли пароль?</Button> */}
                </FormActions>
                {/* <FormFooter>
                    Текст если проблема значит возникла
                </FormFooter> */}
            </Form>
        </Page>
    )
})

export default LoginPage