import { ChangeEvent, FC, ReactNode, useEffect, useState } from "react";
import './styles.scss'
import { getCl, getClR } from "../../helper";
import Image from "../image/image";

interface PageProps {
    children?: ReactNode,
    center?: boolean,
    className?: string
}

const Page: FC<PageProps> = (props: PageProps) => {
    const [prepared, setPrepared] = useState<boolean>(false)

    useEffect(() => {
        setTimeout(() => {
            setPrepared(true)
        }, 10)
    }, [])

    return (
        <div className={`page ${getCl(props.center, 'centered')} ${getCl(prepared, 'prepared')} ${getClR(props.className)}`}>
            {props.children}
        </div>
    )
}

interface PageHeadProps {
    title?: string
    info?: string,
    children?: ReactNode,
    actions?: ReactNode
}

export const PageHead: FC<PageHeadProps> = (props: PageHeadProps) => {
    return (
        <div className="page__header">
            {props.title &&
                <h1 className="page__title">
                    {props.title}
                    {props.info &&
                        <span className="page__title_info">
                            {props.info}
                        </span>
                    }
                </h1>
            }
            {props.actions &&
                <div className="page__actions">
                    {props.actions}
                </div>
            }
            {props.children}
        </div>
    )
}

interface PageBodyProps {
    children?: ReactNode,
}

export const PageBody: FC<PageBodyProps> = (props: PageBodyProps) => {
    return (
        <div className="page__body">
            {props.children}
        </div>
    )
}

interface PageLoaderProps {
    // loaded?: boolean | undefined
}

const PageLoader: FC<PageLoaderProps> = (props: PageLoaderProps) => {
    return (
        <div className={`page__loader`}>
            <div className="loader">
                <div className="loader__object">
                    loader
                </div>
            </div>
        </div>
    )
}

export const PageInDev: FC = () => {
    return (
        <div className="page__develop">
            <div className="page__develop__image">
                <Image src="ref__dev.png" />
            </div>
            <div className="page__develop__text">
                Страница в разработке
            </div>
        </div>
    )
}


export default Page