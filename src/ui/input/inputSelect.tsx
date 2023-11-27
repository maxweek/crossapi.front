import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import './styles.scss'
import { IPropertyItem } from '../../store/store'
import { getCl, getClR, getDateFromFormattedDate, getFormattedDate, getTimestampFromDate } from '../../helper'
import Icon from '../icon/icon';
import Image from '../image/image';



interface IInputSelect {
    options?: IPropertyItem[],
    onChange: (value: any) => void,
    onInput?: (value: any) => void,
    value: any,
    focused: boolean,
    onFocus: () => void
    onBlur: () => void,
    disabled?: boolean
    placeholder?: string
    loading?: boolean
    disableIconColor?: boolean
}

const InputSelect: FC<IInputSelect> = (props: IInputSelect) => {
    const [text, setText] = useState<string>('');
    const componentRef = useRef<HTMLDivElement>(null)
    const [initedOptions, setInitedOptions] = useState<boolean>(false)

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [props.value, props.options])

    useEffect(() => {
        setTitle();
    }, [props.value])
    useEffect(() => {
        if (!initedOptions && props.options?.length) {
            // console.log('inited OPTIONS')
            // debugger
            setInitedOptions(true)
            setTitle()
        }
    }, [props.options])

    // useEffect(() => {
    //     console.log(props.options)
    //     setTitle();
    // }, [props.options])

    const handleClickOutside = (event: any) => {
        if (componentRef.current && !componentRef.current.contains(event.target)) {
            // console.log('click')
            props.onBlur()
            setTitle()
        }
    };
    const selectOption = (id: number) => {
        props.onChange(id)
        setTitle(id);
        // if (ref.current) {
        //     ref.current.value = id.toString()
        // }
    }
    const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
        if (props.onInput) {
            props.onInput(e.target.value)
        }
    }
    const onFocus = () => {
        // document.addEventListener('keydown', keypress)
        setText('')
        props.onFocus()
    }
    function setTitle(id?: number) {
        let _id = id || props.value;
        let opt = props.options?.filter(opt => opt.id === _id)[0]
        // console.log(opt)
        // debugger
        if (opt) {
            setText(opt.title)
        } else {
            setText('')
        }
    }
    const onBlur = () => {
        // document.removeEventListener('keydown', keypress)
        console.log(props.value)
        props.onBlur()
    }

    const keypress = (e: KeyboardEvent) => {
        console.log(e.code)
    }

    const getOptions = () => {
        let arr: IPropertyItem[] = []
        if (props.options?.length) {
            props.options?.map((el, i) => {
                if (text && !el.title.toLowerCase().includes(text.toLowerCase()) && props.focused) {
                    return
                }
                arr.push(el)
            })
            if (arr.length) {
                return arr.map((el, i) => {
                    return (<div className={`input__optionsItem ${getCl(el.id === props.value, 'active')}`} onClick={() => selectOption(el.id)} key={'inputOption__select_' + i}>
                        {el.icon &&
                            <Image src={el.icon} />
                        }
                        {el.color &&
                            <div className={`input__colorIndicator ${el.color}`} />
                        }
                        {el.title}
                    </div>)
                })
            } else {
                return <div className={`input__optionsItem __noVariants`} >Нет вариантов</div>
            }
        } else {
            return <div className={`input__optionsItem __noVariants`} >Нет вариантов</div>
        }
    }
    // const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    //     props.onChange(parseInt(e.target.value))
    // }
    return (
        <>
            <div className='input__box' ref={componentRef}>
                {/* <select onChange={onChange} value={props.value} ref={ref}>
                    {props.options && props.options.map(option => <option value={option.id}>{option.title}</option>)}
                </select> */}

                <input type="text"
                    value={text}
                    onChange={onTextChange}
                    onFocus={onFocus}
                    placeholder={props.placeholder}
                    // onBlur={onBlur}
                    disabled={props.disabled}
                />
                <div className='input__indicator'>
                    <Icon name="chevron-down" />
                </div>
            </div>
            {props.options &&
                <div className='input__options'>
                    <div className={`input__optionsList ${getCl(props.disableIconColor, 'dIcolor')}`}>
                        {props.loading ?
                            <div className={`input__optionsItem __loading`} />
                            :
                            getOptions()
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default InputSelect