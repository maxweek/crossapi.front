import { makeAutoObservable } from "mobx";
import { _IS_DEV } from "../API";
import { IType } from "./store";


export interface ITableStore {
    table: ITable,
    editItem: ITableEditItem,
    items: ITableItem[]
}
export interface ITable {
    id: number,
    name: string,
    fields: IField[],
    updatedAt: string,
    createdAt: string,
}

export interface ITableItem {
    id: number,
    title: string,
    updatedAt: string,
    createdAt: string,
}
export interface ITableEdit {
    id: number | null,
    name: string,
    fields: IField[]
}
export interface ITableEditItem {
    id: number | null,
    fields: IField[],
    data: any,
}

export interface IField {
    type: IType,
    name: string,
    value?: any
}

class _TableStore implements ITableStore {
    table = {} as ITable
    items = [] as ITableItem[];
    editItem = {
        id: null,
        fields: [] as ITableEditItem['fields'],
        data: {}
    } as ITableEditItem;
    editTable = {
        fields: [] as ITableEdit['fields'],
    } as ITableEdit
    constructor() {
        makeAutoObservable(this)
    }
    setTable = (table: ITable) => {
        this.table = table
        //@ts-ignore
        this.table.fields = table.fields
    }
    setItems = (items: ITableItem[]) => {
        this.items = items
    }
    setEditItem = (id: string | undefined, res?: any) => {
        if (id) {
            this.editItem.id = parseInt(id);
        } else {
            this.editItem.id = null;
        }

        const fields = this.table.fields;

        this.editItem.fields = fields;
        this.editItem.data = {};

        this.editItem.fields.map(f => {
            if(f.type.name === 'text') f.value = res ? res[f.name] : ''
            if(f.type.name === 'number') f.value = res ? res[f.name] : ''
            if(f.type.name === 'boolean') f.value = res ? res[f.name] : false

            this.editItem.data[f.name] = f.value
        })
    }
    setEditItemValue = (name: string, value: any) => {
        const field = this.editItem.fields.filter(f => f.name === name)[0]
        if (!field) return;

        field.value = value;

        this.editItem.data[field.name] = value
    }
    setEditTable = (id: string | undefined, res?: any) => {
        if (id) {
            this.editTable.id = parseInt(id);
        } else {
            this.editTable.id = null;
        }
        if (!res) {
            this.editTable.name = ''
            this.editTable.fields = []
            // debugger
        } else {
            this.editTable.name = res.name
            this.editTable.fields = res.fields;
        }
    }
    setEditTableName = (value: string) => {
        this.editTable.name = value;
    }
    setEditTableValue = (name: string, value: any) => {
        const field = this.editTable.fields.filter(f => f.name === name)[0]
        if (!field) return;

        field.name = value
    }
    addEditTableField = (type?: IType) => {
        if (type) {
            this.editTable.fields.push({
                type,
                name: ''
            })
        }
    }
    removeEditTableFieldByIndex = (index: number) => {
        this.editTable.fields.splice(index, 1)
    }

    getFieldsHyper = (fields: IField[]) => {
        let str = '';

        fields.map(f => {
            console.log(f)
            str += `${f.name} - ${f.type.name}<br/>`;
        })
        console.log(str)

        return str;
    }
}

const TableStore = new _TableStore()

export default TableStore;