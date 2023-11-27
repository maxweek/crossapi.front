import { FC, ReactNode, useEffect } from "react";
import './styles.scss';
import { getCl } from "../../helper";
import Image from "../../ui/image/image";
import { NavLink, useLocation } from "react-router-dom";
import Icon, { IIconName } from "../../ui/icon/icon";
import pkg from "../../../package.json";
import ThemeSwitcher from "../../ui/themeSwitcher/themeSwitcher";
import { useAdaptive } from "../../hooks";
import AppStore from "../../store/store";
import User from "../user/user";
import { logOut } from "../../API";
import { observer } from "mobx-react-lite";
import Burger from "../../ui/burger/burger";

interface ISidebar {
    items: ISidebarNavItem[]
}
interface ISidebarNav {
    items: ISidebarNavItem[]
}
interface ISidebarNavItem {
    link: string,
    text: string,
    icon?: IIconName['name'],
    childs?: ISidebarNavItem[]
}

const Sidebar: FC<ISidebar> = observer((props: ISidebar) => {
    const aType = useAdaptive();
    const location = useLocation()

    useEffect(() => {
        if (AppStore.ui.sidebar.isActive) {
            AppStore.setSidebarActive(false)
        }
    }, [location.pathname])

    return (
        <>
            {aType !== 'DESK' &&
                <div className={`sidebar__shadow ${getCl(AppStore.ui.sidebar.isActive, 'active')}`} onClick={() => { AppStore.setSidebarActive(false) }} />
            }
            <aside className={`sidebar ${getCl(aType !== 'DESK' && AppStore.ui.sidebar.isActive, 'active')}`}>
                <div className="sidebar__inner">
                    <div className="sidebar__header">
                        {aType === 'DESK' ?
                            <NavLink to="/" className={'logo'}>
                                <div className="logo_text">
                                    <span>crossapi</span>
                                </div>
                                {/* <Image src="logo.svg" /> */}
                            </NavLink>
                            :
                            <>
                                <User user={AppStore.user} />
                                <div className="sidebar__header_actions">
                                    <Burger />
                                    {/* <a onClick={() => { logOut() }}>Выход</a> */}
                                </div>
                            </>
                        }
                    </div>
                    <div className="sidebar__body">
                        <SidebarNav items={props.items} />
                    </div>
                    <div className="sidebar__footer">
                    </div>
                </div>
                <div className="sidebar__footer">
                    <div className="sidebar__footer_row">
                        {aType !== 'DESK' &&
                            <ThemeSwitcher />
                        }
                        <div className="_version">v. {pkg.version}</div>
                        {aType !== 'DESK' &&
                            <a onClick={() => { logOut() }}>Выход</a>
                        }
                    </div>
                </div>
            </aside>
        </>
    )
})

const SidebarNav: FC<ISidebarNav> = (props: ISidebarNav) => {
    const location = useLocation();
    return (
        <div className="sidebar__nav">
            {props.items.map((item, i) => {
                return (
                    <div className="sidebar__box">
                        <NavLink className={`sidebar__item ${getCl(location.pathname.includes(item.link), 'active')}`} to={item.link} key={'sidebarNav__' + i}>
                            {item.icon &&
                                <Icon name={item.icon} />
                            }
                            {item.text}
                        </NavLink>
                        {item.childs &&
                            <SidebarNav items={item.childs} />
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default Sidebar;