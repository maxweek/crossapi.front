import { FC, ReactNode } from "react";
import { getCl, getClR } from "../../helper";
import "./styles.scss";

interface FormProps {
    children: ReactNode,
    className?: string,
    asModule: boolean
}
const Form: FC<FormProps> = (props: FormProps) => {
    return (
        <div className={`form ${getClR(props.className)} ${getCl(props.asModule, 'module')}`}>
            {props.children}
        </div>
    )
}

interface FormHeaderProps {
    title: string,
    subtitle?: string,
    children?: ReactNode
}
export const FormHeader: FC<FormHeaderProps> = (props: FormHeaderProps) => {
    return (
        <div className="form__header">
            <h1 className="form__title">
                {props.title}
            </h1>
            <div className="form__subtitle">
                {props.subtitle}
            </div>
            {props.children}
        </div>
    )
}

interface FormBodyProps {
    children: ReactNode
}
export const FormBody: FC<FormBodyProps> = (props: FormBodyProps) => {
    return (
        <div className="form__body">
            {props.children}
        </div>
    )
}

interface FormRowProps {
    children: ReactNode,
    className?: string,
    align?: 'flex-start' | 'flex-end' | 'center',
}
export const FormRow: FC<FormRowProps> = (props: FormRowProps) => {
    return (
        <div className={`form__row ${getClR(props.className)} ${getCl(!!props.align, 'align_' +props.align)}`}>
            {props.children}
        </div>
    )
}

interface FormColProps {
    children: ReactNode,
    asRow?: boolean,
    width?: string,
    align?: 'flex-start' | 'flex-end' | 'center',
}
export const FormCol: FC<FormColProps> = (props: FormColProps) => {
    return (
        <div className={`form__col ${getCl(props.asRow, 'asRow')} ${getCl(!!props.align, 'align_' + props.align)}`} style={props.width ? {flexBasis: props.width} : {}}>
            {props.children}
        </div>
    )
}

interface FormActionsProps {
    children: ReactNode
}
export const FormActions: FC<FormActionsProps> = (props: FormActionsProps) => {
    return (
        <div className="form__actions">
            {props.children}
        </div>
    )
}

interface FormFooterProps {
    children: ReactNode
}
export const FormFooter: FC<FormFooterProps> = (props: FormFooterProps) => {
    return (
        <div className="form__footer">
            {props.children}
        </div>
    )
}

interface FormHrProps {

}
export const FormHr: FC<FormHrProps> = (props: FormHrProps) => {
    return (
        <div className="form__hr" />
    )
}

export default Form;