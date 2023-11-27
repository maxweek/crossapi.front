import { FC, useEffect } from "react";
import { getCookie, setCookie } from "../helper";
import AppStore from "../store/store";
import { observer } from "mobx-react-lite";


const Themer: FC = observer(() => {
    useEffect(() => {
        const definedTheme = getCookie('theme');
        if (definedTheme) {
            AppStore.changeTheme(definedTheme)
        } else {
            const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
            if (darkThemeMq.matches) {
                AppStore.changeTheme('dark')
            } else {
                AppStore.changeTheme('light')
            }
        }

    }, [])

    useEffect(() => {
        if (!AppStore.ui.theme) return;
        let body = document.querySelector('body')
        if (body) {
            body.classList.add('__themeChanging')
            setTimeout(() => {
                if (body) {
                    body.classList.remove('__theme_light')
                    body.classList.remove('__theme_dark')
                    body.classList.add('__theme_' + AppStore.ui.theme)
                }
            }, 400)
            setTimeout(() => {
                if (body) {
                    body.classList.remove('__themeChanging')
                }
            }, 600)
            setCookie('theme', AppStore.ui.theme)
        }
    }, [AppStore.ui.theme])
    return (
        <></>
    )
})

export default Themer