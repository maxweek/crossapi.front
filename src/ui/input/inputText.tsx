import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import './styles.scss'
import { getCl, getClR, getDateFromFormattedDate, getFormattedDate, getTimestampFromDate } from '../../helper'
import Button from '../button/button';
import Icon from '../icon/icon';
import Image from '../image/image';


interface IInputText {
    inputType?: string,
    onFocus: () => void,
    onBlur: () => void,
    onChange: (value: any) => void,
    value: string | undefined,
    textarea?: boolean,
    disabled?: boolean
}

const InputText: FC<IInputText> = (props: IInputText) => {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.target.value)
    }

    useEffect(() => {
        if (props.value === null || props.value === undefined) {
            if (typeof props.onChange === 'function') {
                props.onChange('')
            }
        }
    }, [props.value])
    return (
        <div className='input__box'>
            <input
                type={props.inputType || 'text'}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onChange={onChange}
                value={props.value}
                disabled={props.disabled}
                spellCheck={false}
                autoComplete={'off'}
                autoCorrect={'off'}
                autoCapitalize={'off'}
            />
        </div>
    )
}


export default InputText