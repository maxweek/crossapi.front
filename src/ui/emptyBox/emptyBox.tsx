import { FC, ReactNode, useEffect, useState } from "react";
import './styles.scss';

interface Props {
    text?: string
}

const EmptyBox: FC<Props> = (props: Props) => {
    return (
        <div className={`emptyBox`}>
            {props.text || 'Нет результатов'}
        </div>
    )
}

export default EmptyBox;