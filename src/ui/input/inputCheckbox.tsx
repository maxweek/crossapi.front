import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import './styles.scss'
import Icon from '../icon/icon';
import { getCl } from '../../helper';



interface IInputCheckbox {
    onChange: (value: any) => void,
    value: boolean,
    disabled?: boolean
    loading?: boolean
    focused: boolean,
    label?: string,
    onFocus: () => void,
    onBlur: () => void,
}

const InputCheckbox: FC<IInputCheckbox> = (props: IInputCheckbox) => {
    const componentRef = useRef<HTMLDivElement>(null)

    const onChange = () => {
        props.onChange(!props.value)
    }

    return (
        <>
            <div className={`input__box ${getCl(props.value, 'active')}`} ref={componentRef} onClick={onChange}>
                <input type="checkbox"
                    checked={props.value}
                    onChange={onChange}
                    disabled={props.disabled}
                />
                <div className={`input__indicator`}>
                    <Icon name="check" />
                </div>
                {props.label &&
                    <div className='input__label'>
                        {props.label}
                    </div>
                }
            </div>
        </>
    )
}

export default InputCheckbox