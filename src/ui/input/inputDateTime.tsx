import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import './styles.scss'
import 'react-calendar/dist/Calendar.css';
import { getCl, getClR, getDateFromFormattedDate, getFormattedDate, getTimestampFromDate } from '../../helper'
import Calendar from 'react-calendar'
import Button from '../button/button';

interface IInputDateTime {
    onFocus: () => void,
    onBlur: () => void,
    onChange: (value: any) => void,
    value: any,
    format?: string,
    datevalue?: string[],
    allowRangeDate?: boolean,
    hourList?: number[],
    minuteList?: number[],
    disabled?: boolean,
    componentRef: React.RefObject<HTMLDivElement>
}

const InputDateTime: FC<IInputDateTime> = (props: IInputDateTime) => {
    // const componentRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef(null)
    const [text, setText] = useState<string>();
    const [changed, setChanged] = useState<number>();

    useEffect(() => {
        setText(getFormattedDate(props.value, props.format));
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [props.value, props.datevalue, props.format]);

    const handleClickOutside = (event: any) => {
        if (props.componentRef.current && !props.componentRef.current.contains(event.target)) {
            if (!event.target.classList.contains('react-calendar__tile')) {
                props.onBlur();
            }


        }
    };

    const onViewChange = () => {
        console.log('changed view')

        setChanged(Math.random())
    }

    const onChange = (value: any, type: boolean) => {
        let val = value;
        if (!type && props.value) {
            val.setHours(new Date(props.value).getHours())
            val.setMinutes(new Date(props.value).getMinutes())
            // val.setMinutes(-val.getTimezoneOffset())
        }
        props.onChange(getTimestampFromDate(val))
    }

    let date = new Date(props.value)
    // date.setMinutes(-date.getTimezoneOffset())

    return (
        <>
            <div className='input__box'>
                <div className='_input' onClick={props.onFocus}>
                    {text}
                </div>
            </div>
            <div className='input__calendar'>
                <div className='input__calendarDrop'>
                    <div className='input__calendarList'>
                        <Calendar
                            value={props.value ? date : null}
                            onChange={value => onChange(value, false)}
                            onViewChange={onViewChange}
                            minDate={new Date()}
                            inputRef={calendarRef}

                        // value={props.allowRangeDate ? props.datevalue : props.value}
                        // selectRange={props.allowRangeDate}
                        />
                    </div>
                    {(props.value && props.hourList) &&
                        <div className='input__timeBox'>
                            <div className='input__timeList'>
                                {props.hourList.map((time, i) => (
                                    <Button
                                        type={new Date(props.value).getHours() == time ? "primary" : "secondary"}
                                        classList='input__timeItem'
                                        key={'inputOption__selectTime_' + i}
                                        onClick={() => {
                                            let date: Date = new Date(props.value)
                                            date.setHours(time)
                                            onChange(date, true)
                                        }}>
                                        {(time).toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    }
                    {(props.value && props.minuteList) &&
                        <div className='input__timeBox'>
                            <div className='input__timeList'>
                                {props.minuteList.map((time, i) => (
                                    <Button
                                        type={new Date(props.value).getMinutes() == time ? "primary" : "secondary"}
                                        classList='input__timeItem'
                                        key={'inputOption__selectTime_' + i}
                                        onClick={() => {
                                            let date: Date = new Date(props.value)
                                            date.setMinutes(time)
                                            onChange(date, true)
                                        }}>
                                        {(time).toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};


export default InputDateTime