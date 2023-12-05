import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import './styles.scss'
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';


interface IInputEditor {
    onFocus: () => void,
    onBlur: () => void,
    onChange: (value: any) => void,
    value: string | undefined,
    disabled?: boolean
}

const InputEditor: FC<IInputEditor> = (props: IInputEditor) => {
    const onChange = (e: string) => {
        props.onChange(e)
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
            <FroalaEditor
                tag='textarea'
                config={{
                    placeholderText: 'Edit Your Content Here!',
                    charCounterCount: false
                }}
                model={props.value}
                onModelChange={onChange}
            />
        </div>
    )
}


export default InputEditor