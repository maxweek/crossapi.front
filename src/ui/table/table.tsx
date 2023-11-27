import React, { FC, PointerEvent, PointerEventHandler, useEffect, useRef, useState } from "react";
import './styles.scss';
import { getCl, getClR, getRawHtml } from "../../helper";
import EmptyBox from "../emptyBox/emptyBox";

export interface ITable {
    thead: {
        title: any,
        width?: string,
        align?: 'center' | 'right',
        className?: string,
    }[],
    disableHead?: boolean,
    tbody?: any[][],
    className?: string,
    disableFilledHeader?: boolean,
    headCellWidth?: number[],
    setHeadCellWidth?: (v: number[]) => void,
    empty?: boolean,
    sort?: number[]
}

const pointer = {
    isDrag: false,
    target: HTMLTableRowElement,
    oldY: null,
    y: null,
    distY: null,

}

export const Table: FC<ITable> = (props: ITable) => {
    const ref = useRef<HTMLTableElement>(null)
    const tableRef = useRef<HTMLDivElement>(null)
    const [filledHeader, setFilledHeader] = useState(true)
    const [headCellWidth, setHeadCellWidth] = useState<number[]>([]);
    const rowRef = useRef<HTMLTableRowElement>(null)

    useEffect(() => {
        setHead()
    }, [rowRef, props.thead, props.tbody])

    useEffect(() => {
        if (props.headCellWidth) {
            setHeadCellWidth(props.headCellWidth)
        }
    }, [props.headCellWidth])

    const setHead = () => {
        if (!rowRef.current) return;
        let arr: number[] = [];
        let tds = rowRef.current.querySelectorAll('td')
        tds?.forEach(td => {
            arr.push(td.offsetWidth)
        })
        setHeadCellWidth(arr)
        if (typeof props.setHeadCellWidth === 'function') {
            props.setHeadCellWidth(arr)
        }
    }

    return (
        <div className={`table ${getClR(props.className)} ${getCl(filledHeader, 'filledHeader')}`} ref={tableRef}>
            {(props.thead && !props.disableHead) &&
                <div className="table__header" ref={ref}>
                    <table>
                        <thead>
                            <tr>
                                {props.thead.map((head, i) => (
                                    <th className={`${getCl(!!head.align, head.align)} ${getClR(head.className)}`}
                                        style={{ width: headCellWidth[i] }}
                                        key={'tableHead__' + i}
                                    >
                                        <div className="col_h" dangerouslySetInnerHTML={getRawHtml(head.title)}></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                </div>
            }
            {(props.tbody && props.tbody?.length) ?
                <table>
                    <tbody>
                        {props.tbody.map((row, irow) => {
                            let i = 0
                            return (
                                <tr key={'tableRow__' + irow}>
                                    {row.map((cell, icell) => {
                                        let head: any = props.thead[i];
                                        i++;
                                        if (head === undefined) {
                                            // console.log(row)
                                            // debugger
                                            return <></>
                                        }
                                        return (
                                            <td className={`${getCl(!!head.align, head.align)} ${getClR(head.className)}`} style={{ width: head.width }} key={'tableCell__' + irow + '_' + icell}>
                                                <div className="col">
                                                    {cell}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        {props.thead &&
                            <tr ref={rowRef} className="td__hidden">
                                {props.thead.map((head, icell) => <td key={'tableCell__last_' + icell}>{head.title}</td>)}
                            </tr>
                        }
                    </tbody>
                </table>
                : props.empty ? <EmptyBox /> : null}
        </div>
    )
}

export const Table_LoadMask: FC = () => {
    const count = 20;
    return (
        <div className="table__loadMask">
            <div className="table__head"></div>
            <div className="table__body">
                {Array.from({ length: count }).map((el, i) =>
                    <div className="table__row" key={'tableMask__' + i} >
                        <div className="table__cell" />
                    </div>
                )}
            </div>
        </div>
    )
}


export default Table;