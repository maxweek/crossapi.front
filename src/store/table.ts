import { makeAutoObservable } from "mobx";
import { _IS_DEV } from "../API";


export interface ITableStore {
    table: ITable,
    editItem: ITableEditItem,
    items: ITableItem[]
}
export interface ITable {
    id: number,
    name: string,
    fields: string,
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
    type: string,
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
    }
    setItems = (items: ITableItem[]) => {
        this.items = items
    }
    setEditItem = (id: string | undefined, res?: any) => {
        if(id){
            this.editItem.id = parseInt(id);
        } else {
            this.editItem.id = null;
        }

        const fields = JSON.parse(this.table.fields);

        this.editItem.fields = fields;
        this.editItem.data = {};

        if (!res) {
            this.editItem.fields.map(f => {
                if (f.type === 'string') {
                    f.value = ''
                }
            })
        } else {
            this.editItem.fields.map(f => {
                if (f.type === 'string') {
                    f.value = res[f.name]
                }
            })
        }
    }
    setEditItemValue = (name: string, value: any) => {
        const field = this.editItem.fields.filter(f => f.name === name)[0]
        if (!field) return;

        field.value = value;

        this.editItem.data[field.name] = value;
    }
    setEditTable = (id: string | undefined, res?: any) => {
        if(id){
            this.editTable.id = parseInt(id);
        } else {
            this.editTable.id = null;
        }
        if(!res){
            this.editTable.name = ''
            this.editTable.fields = []
            // debugger
        } else {
            this.editTable.name = res.name
            this.editTable.fields = JSON.parse(res.fields);
        }
    }
    setEditTableName = (value: string) => {
        this.editTable.name = value;
    }
    setEditTableValue = (name: string, value: any) => {
        const field = this.editTable.fields.filter(f => f.name === name)[0]
        if(!field) return;

        field.name = value
    }
    addEditTableField = (field?: IField) => {
        this.editTable.fields.push({
            name: '',
            type: 'string'
        })
    }

    getFieldsHyper = (_fields: string) => {
        const fields: IField[] = JSON.parse(_fields);
        let str = '';
        
        fields.map(f => {
            str += `${f.name} - ${f.type}<br/>`;
        })
        console.log(str)

        return str;
    }
}

const TableStore = new _TableStore()

export default TableStore;