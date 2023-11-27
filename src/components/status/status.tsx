import { FC, ReactNode, useEffect, useState } from "react";
import './styles.scss';
import { getCl } from "../../helper";

export interface IStatus {
    type: 0 | 1 | 2 | 3 | 4,
    text: string,
}

const Status: FC<IStatus> = (props: IStatus) => {
    const [type, setType] = useState<string>('')
    useEffect(() => {
        let _type = '';
        switch (props.type) {
            case 0:
                _type = 'inactive'
                break;
            case 1:
                _type = 'active'
                break;
            case 2:
                _type = 'process'
                break;
            case 3:
                _type = 'prepared'
                break;
            case 4:
                _type = 'canceled'
                break;
        }
        setType(_type);
    }, [props.type])
    return (
        <div className={`status ${getCl(!!type, type)}`}>
            {props.text}
        </div>
    )
}

export default Status;