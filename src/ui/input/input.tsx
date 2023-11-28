import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import './styles.scss'
import { getCl, getClR, getDateFromFormattedDate, getFormattedDate, getTimestampFromDate } from '../../helper'
import InputText from './inputText';
import InputTextArea from './inputTextArea';
import InputSelect from './inputSelect';
import InputSelectMulti from './inputSelectMulti';
import InputCheckbox from './inputCheckbox';
import InputNumber from './inputNumber';

interface IInput {
    type: 'number' | 'text' | 'select' | 'datetime' | 'textarea' | 'multiselect' | 'password' | 'checkbox',
    inputType?: string,
    className?: string,
    value: any,
    error?: any,
    label?: string,
    placeholder?: string,
    options?: any[],
    format?: string,
    disabled?: boolean,
    datevalue?: string[],
    allowRangeDate?: boolean,
    loading?: boolean,
    hourList?: number[],
    minuteList?: number[],
    rows?: number,
    minRows?: number,
    maxRows?: number,
    disableIconColor?: boolean
    align?: 'center' | 'right',
    onChange: (value: any) => void,
    onInput?: (value: any) => void,
}

const Input: FC<IInput> = (props: IInput) => {
    const [focused, setFocused] = useState<boolean>(false)
    const [filled, setFilled] = useState<boolean>(false)
    const [zIndex, setZIndex] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null);

    useEffect(checkLabel, [props.value])
    useEffect(() => {
        focused ? setZIndex(true) : setTimeout(() => setZIndex(false), 200)
    }, [focused])

    const onChange = (value: any) => {
        props.onChange(value)
    }
    const onFocus = () => {
        setFocused(true)
    }
    const onBlur = () => {
        setFocused(false)
        checkLabel()
    }

    function checkLabel() {
        let law = true;
        // console.log(props.value, 'props.value')
        if (props.value === undefined || props.value === '' || props.value === null) law = false
        setFilled(law)
    }

    const classes = [
        getCl(!!props.type, props.type),
        getCl(filled, 'filled'),
        getCl(focused, 'focused'),
        getCl(zIndex, 'zIndex'),
        getCl(props.disabled, 'disabled'),
        getCl(props.error, 'error'),
        getCl(!!props.label, 'label'),
        getCl(!!props.align, 'align_' + props.align),
        getClR(props.className),
    ].join(' ');

    return (
        <div className={`input ${classes}`} ref={ref}>
            {(props.label && props.type !== 'checkbox') &&
                <div className='input__label'>
                    {props.label}
                </div>
            }
            {props.type === 'text' &&
                <InputText
                    inputType={props.inputType}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={props.value}
                    disabled={props.disabled}
                />
            }
            {props.type === 'number' &&
                <InputNumber
                    inputType={props.inputType}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={props.value}
                    disabled={props.disabled}
                />
            }
            {props.type === 'textarea' &&
                <InputTextArea
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={props.value}
                    disabled={props.disabled}
                    rows={props.rows}
                    minRows={props.minRows}
                    maxRows={props.maxRows}

                />
            }
            {props.type === 'select' &&
                <InputSelect
                    onChange={onChange}
                    options={props.options}
                    value={props.value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onInput={props.onInput}
                    focused={focused}
                    disabled={props.disabled}
                    loading={props.loading}
                    placeholder={props.placeholder}
                    disableIconColor={props.disableIconColor}
                />
            }
            {props.type === 'multiselect' &&
                <InputSelectMulti
                    onChange={onChange}
                    options={props.options}
                    value={props.value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    focused={focused}
                    disabled={props.disabled}
                />
            }
            {props.type === 'checkbox' &&
                <InputCheckbox
                    onChange={onChange}
                    value={props.value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    focused={focused}
                    disabled={props.disabled}
                    label={props.label}
                />
            }
            {props.error &&
                <div className='input__error'>
                    {props.error}
                </div>
            }
        </div>
    )
}


export default Input