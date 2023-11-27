import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import './styles.scss'
import { IPropertyItem } from '../../store/store'
import { getCl, getClR, getDateFromFormattedDate, getFormattedDate, getTimestampFromDate } from '../../helper'
import Icon from '../icon/icon';
import Image from '../image/image';

interface IInputSelectMulti {
    options?: IPropertyItem[],
    onChange: (value: any) => void,
    value: number[] | undefined,
    focused: boolean,
    onFocus: () => void
    onBlur: () => void,
    disabled?: boolean
}

const InputSelectMulti: FC<IInputSelectMulti> = (props: IInputSelectMulti) => {
    const componentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [props.value])

    const handleClickOutside = (event: any) => {
        if (componentRef.current && !componentRef.current.contains(event.target)) {
            props.onBlur()
            // setTitle()
        }
    };
    const selectOption = (id: number) => {
        if (props.value) {
            if (props.value?.includes(id)) {
                removeValue(id)
            } else {
                props.onChange([...props.value, id])
            }
        } else {
            props.onChange([id])
        }
    }
    const onFocus = () => {
        props.onFocus()
    }
    const onBlur = () => {
        props.onBlur()
    }
    const addValue = (id: number) => {

    }
    const getValue = (id: number) => {
        let opt = props.options?.filter(opt => opt.id === id)[0]
        return opt?.title
    }
    const removeValue = (id: number) => {
        let value = props.value?.filter(val => val !== id)
        // console.log(value, props.value)
        props.onChange(value)
    }
    // console.log(props.value)
    // debugger
    return (
        <>
            <div className='input__box' ref={componentRef} onClick={onFocus} onFocus={onFocus} tabIndex={20}>
                {/* <select onChange={onChange} value={props.value} ref={ref}>
                    {props.options && props.options.map(option => <option value={option.id}>{option.title}</option>)}
                </select> */}
                <div className='_input'>
                    {props.value?.map((val, i) => {
                        return (
                            <div
                                className='input__box_value'
                                onClick={() => { removeValue(val) }}
                                key={'inputOption__value_' + i}
                            >
                                {getValue(val)}
                                <Icon name="x" />
                            </div>
                        )
                    })}
                </div>
                <div className='input__indicator'>
                    <Icon name="chevron-down" />
                </div>
            </div>
            {props.options &&
                <div className='input__options'>
                    <div className='input__optionsList'>
                        {props.options.map((el, i) => {
                            return (
                                <div
                                    className={`input__optionsItem ${getCl(props.value?.includes(el.id), 'active')}`}
                                    onClick={() => selectOption(el.id)}
                                    key={'inputOption__select_' + i}
                                >
                                    {el.icon &&
                                        <Image src={el.icon} />
                                    }
                                    {el.color &&
                                        <div className={`input__colorIndicator ${el.color}`} />
                                    }
                                    {el.title}
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    )
}

export default InputSelectMulti