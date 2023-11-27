import { FC, ReactNode, useEffect, useState } from "react";
import './styles.scss';
import { getCl } from "../../helper";
import Image from "../../ui/image/image";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "../../ui/icon/icon";
import AppStore from "../../store/store";
import User from "../user/user";
import { observer } from "mobx-react-lite";
import { logOut } from "../../API";
import ThemeSwitcher from "../../ui/themeSwitcher/themeSwitcher";
import { useAdaptive } from "../../hooks";
import Burger from "../../ui/burger/burger";

interface Props {
}

const Header: FC<Props> = observer((props: Props) => {
    const [filled, setFilled] = useState<boolean>(false);
    const aType = useAdaptive();
    useEffect(() => {
        window.addEventListener('scroll', checkScroll)
        return () => {
            window.removeEventListener('scroll', checkScroll)
        }
    }, [])

    function checkScroll() {
        setFilled(window.scrollY > 16)
    }

    const burgerClick = () => {
        console.log('123')
        AppStore.setSidebarActive(true)
    }
    return (
        <header className={`header ${getCl(filled, 'filled')}`}>
            <div className="header__inner">
                <div className="header__col">
                    {aType === 'DESK' ?
                        <User user={AppStore.user} />
                        :
                        <NavLink to="/" className={'logo'}>
                            {/* CrossApi */}
                            <Image src="logo.svg" />
                        </NavLink>
                    }
                </div>
                <div className="header__col">
                    <div className="header__actions">
                        {aType === 'DESK' ?
                            <>
                                <ThemeSwitcher />
                                <a onClick={() => { logOut() }}>Выход</a>
                            </>
                            :
                            <>
                                <User user={AppStore.user} small={true} />
                                <Burger />
                            </>
                        }
                    </div>
                </div>
            </div>
        </header>
    )
})

export default Header;