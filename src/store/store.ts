import { makeAutoObservable } from "mobx";
import { _IS_DEV } from "../API";

export interface IUser {
    id: number,
    name: string,
    surname: string,
    image: string,
    email: string,
    properties: {
        city: number | null
    }
}

export interface ITable {
    id: number,
    name: string,
    fields: string,
    updatedAt: string,
    createdAt: string,
}

interface IStore {
    isLogged: boolean,
    user: IUser,
    ui: {
        theme: string
        sidebar: {
            isActive: boolean
        }
    }
}

console.log('init store')

class Store implements IStore {
    isLogged = true
    ui = {
        theme: 'dark',
        sidebar: {
            isActive: false
        }
    }
    user = {
        id: 0,
        name: '',
        surname: '',
        image: '',
        email: '',
        properties: {
            city: null as number | null
        }
    }
    tables = [] as ITable[]
    constructor() {
        makeAutoObservable(this)
        setTimeout(() => {
            if (_IS_DEV) {
                this.user.email = 'yb.apple.dev@gmail.com'
            }
        }, 0)
    }
    changeTheme = (type?: string) => {
        if (type) {
            this.ui.theme = type
        } else {
            this.ui.theme = this.ui.theme === 'dark' ? 'light' : 'dark'
        }
    }
    setLogged = (type: boolean) => {
        this.isLogged = type
    }
    getUserEmail = () => {
        return this.user.email
    }
    setUser = (user: IUser) => {
        this.user = user;
    }
    setUserEmail = (login: string) => {
        this.user.email = login
    }
    setTables = (tables: ITable[]) => {
        this.tables = tables;
    }
    setSidebarActive = (type?: boolean) => {
        if(type === undefined){
            this.ui.sidebar.isActive = !this.ui.sidebar.isActive;
        } else {
            this.ui.sidebar.isActive = type;
        }
    }
}

const AppStore = new Store()

export default AppStore;