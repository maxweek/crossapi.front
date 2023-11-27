import { FC, ReactNode, useEffect, useState } from "react";
import './styles.scss';
import { getCl } from "../../helper";

interface Props {
    page: number,
    total: number,
    limit: number,
    goToPage: (page: number) => void
}

const Paginator: FC<Props> = (props: Props) => {
    const [pagesCount, setPagesCount] = useState<number>(0)
    const blur = 2;

    useEffect(() => {
        setPagesCount(Math.ceil(props.total / props.limit));
    }, [props.total])

    const onClick = (page: number) => {
        if (page !== null) {
            props.goToPage(page)
        }
    }

    const getPages = () => {
        let pagesArr = getPagesArray(pagesCount, 3, props.page);

        return pagesArr
    }

    if(getPages().length <= 1){
        return <></>
    }

    return (
        <div className="paginator">
            <div className="paginator__list">
                {getPages().map((page, i) => {
                    return (
                        <div
                        key={'paginator__page_' + i}
                            className={`paginator__page ${getCl(page === props.page, 'active')} ${getCl(page === null, 'divider')}`}
                            onClick={() => onClick(page)}>
                            {page ? page : '...'}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function getPagesArray(totalPages: number, blur: number, currentPage: number): any[] {
    if (totalPages <= 10) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: any[] = [];
    const startPage = Math.max(1, currentPage - blur);
    const endPage = Math.min(totalPages, currentPage + blur);

    if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
            pages.push(null); // Add ellipsis
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pages.push(null); // Add ellipsis
        }
        pages.push(totalPages);
    }

    return pages;
}

export default Paginator;