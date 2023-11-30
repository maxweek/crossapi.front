import { makeAutoObservable } from "mobx";
import { _IS_DEV } from "../API";
import { IType } from "./store";
import { IField } from "./table";


export interface IStatikStore {
    editItem: IStatik,
}


export interface IStatik {
    id: number | null,
    name: string,
    url: string,
    fields: IField[],
    updatedAt: string,
    createdAt: string,
}

class _StatikStore implements IStatikStore {
    editItem = {
        fields: [] as IStatik['fields'],
    } as IStatik;
    initedUrl = false;
    constructor() {
        makeAutoObservable(this)
    }
    setEditItem = (id: string | undefined, res?: any) => {
        if (id) {
            this.editItem.id = parseInt(id);
        } else {
            this.editItem.id = null;
        }
        if(res) {
            this.editItem = res

        }

    }
    setEditItemName = (name: string) => {
        this.editItem.name = name;
        if (!this.initedUrl) {
            this.editItem.url = name;
        }
    }
    setEditItemUrl = (url: string) => {
        this.editItem.url = url;
        if(url){
            this.initedUrl = true
        }
    }
    setEditItemValue = (name: string, value: any) => {
        const field = this.editItem.fields.filter(f => f.name === name)[0]
        if (!field) return;

        field.value = value;
    }
    setEditItemFieldName = (name: string, value: any) => {
        const field = this.editItem.fields.filter(f => f.name === name)[0]
        if (!field) return;

        field.name = value;
    }


    addEditItemField = (type?: IType) => {
        if (type) {
            this.editItem.fields.push({
                type,
                name: ''
            })
        }
    }
}

const StatikStore = new _StatikStore()

export default StatikStore;