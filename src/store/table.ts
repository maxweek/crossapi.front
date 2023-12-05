import { makeAutoObservable } from "mobx";
import { _IS_DEV } from "../API";
import { IPropertyItem, IType } from "./store";


export interface ITableStore {
    table: ITable,
    editItem: ITableEditItem,
    items: ITableItem[]
}
export interface ITable {
    id: number,
    name: string,
    publicName: string,
    active: boolean,
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
    publicName: string,
    active: boolean,
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
    options?: IPropertyItem[]
}

class _TableStore implements ITableStore {
    table = {} as ITable
    items = [] as ITableItem[];
    editItem = {
        fields: [] as ITableEditItem['fields'],
        data: {}
    } as ITableEditItem;
    editTable = {
        name: 'Hats',
        publicName: 'Шляпы',
        active: true,
        fields: [
            {
                type: {
                    name: "text",
                    description: "simple text",
                    color: "#f30954",
                    tsType: "string",
                    dbType: "DataTypes.STRING",
                    values: ""
                },
                name: "name"
            },
            {
                type: {
                    name: "number",
                    description: "simple number",
                    color: "#fd46d9",
                    tsType: "number",
                    dbType: "DataTypes.NUMBER",
                    values: ""
                },
                name: "price"
            },
            {
                type: {
                    name: "boolean",
                    description: "simple booly",
                    color: "#a53d9f",
                    tsType: "boolean",
                    dbType: "DataTypes.BOOLEAN",
                    values: [
                        true,
                        null,
                        false
                    ]
                },
                name: "active"
            },
            {
                type: {
                    name: "json",
                    description: "JSON",
                    color: "#a5ad1f",
                    tsType: "any",
                    dbType: "DataTypes.JSON",
                    values: ""
                },
                name: "json"
            },
            {
                type: {
                    name: "date",
                    description: "simple date",
                    color: "#aff4d0",
                    tsType: "string",
                    dbType: "DataTypes.DATE",
                    values: ""
                },
                name: "date"
            },
            {
                type: {
                    name: "uuid",
                    description: "unique id",
                    color: "#aff4d0",
                    tsType: "any",
                    dbType: "DataTypes.UUID",
                    values: ""
                },
                name: "unique"
            },
            {
                type: {
                    name: "list",
                    description: "simple list",
                    color: "#aff4d0",
                    tsType: "string[]",
                    dbType: "DataTypes.ENUM",
                    values: ""
                },
                name: "list"
            }
        ] as ITableEdit['fields'],
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
            f.value = res ? res[f.name] : ''
            if (f.type.name === 'boolean') f.value = res ? res[f.name] : false

            this.editItem.data[f.name] = f.value
        })
    }
    setEditItemValue = (name: string, value: any) => {
        const field = this.editItem.fields.filter(f => f.name === name)[0]
        if (!field) return;

        field.value = value;
        this.editItem.data[field.name] = value
        console.log(JSON.parse(JSON.stringify(this.editItem.data[field.name])))
    }
    setEditTable = (id: string | undefined, res?: any) => {
        if (id) {
            this.editTable.id = parseInt(id);
        } else {
            this.editTable.id = null;
        }
        if (!res) {
            this.editTable.name = ''
            this.editTable.publicName = ''
            this.editTable.fields = []
            // debugger
        } else {
            this.editTable.name = res.name
            this.editTable.publicName = res.publicName
            this.editTable.fields = res.fields;
        }
    }
    setEditTableActive = (value: boolean) => {
        this.editTable.active = value;
    }
    setEditTableName = (value: string) => {
        let letters = value.split('');
        if (letters[0]) {
            letters[0] = letters[0].toUpperCase();
        }
        this.editTable.name = letters.join('');
    }
    setEditTablePublicName = (value: string) => {
        this.editTable.publicName = value;
    }
    setEditTableValue = (name: string, value: any) => {
        const field = this.editTable.fields.filter(f => f.name === name)[0]
        if (!field) return;

        field.name = value
    }
    setEditTableOption = (parName: string, index: number, value: any) => {
        const field = this.editTable.fields.filter(f => f.name === parName)[0]
        if (!field) return;
        if (field.options) {
            field.options[index].title = value;
        }
    }
    setEditTableOptionAdd = (parName: string) => {
        const field = this.editTable.fields.filter(f => f.name === parName)[0]
        if (!field) return;

        let id = 0;
        if (!field.options) {
            field.options = []
        } else {
            id = field.options.length
        }
        field.options.push({
            id,
            title: ''
        })
    }
    setEditTableOptionRemove = (parName: string, index: number) => {
        const field = this.editTable.fields.filter(f => f.name === parName)[0]
        if (!field) return;

        if(field.options){
            field.options.splice(index, 1)
        }
    }
    addEditTableField = (type?: IType) => {
        if (type) {
            this.editTable.fields.push({
                type,
                name: ''
            })
        }
        console.log(this.editTable)
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