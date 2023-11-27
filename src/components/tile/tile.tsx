import { FC, ReactNode, useEffect, useRef, useState } from "react";
import './styles.scss';
import { getCl, getClR } from "../../helper";
import Image from "../../ui/image/image";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "../../ui/icon/icon";
import AppStore from "../../store/store";

interface Props {
    children?: ReactNode,
    loaded?: boolean,
    className?: string,
    needBack?: boolean,
    loadMask?: ReactNode,
    loader?: boolean,
    title?: string,
    highlightOnUpdate?: boolean,
}

const Tile: FC<Props> = (props: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(300);

    useEffect(() => {
        // console.log('upd')
        if (props.highlightOnUpdate) {
            mainRef.current?.classList.add('__highlight')
        }
        if (props.children) {
            setTimeout(() => {
                if (ref.current) {
                    // setHeight(ref.current.clientHeight)
                    mainRef.current?.classList.remove('__highlight')
                    // setHighlight(false)
                }
            }, 200)
        }
    }, [props.children])


    useEffect(() => {
        if (ref.current) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    setHeight(entry.contentRect.height);
                }
            });
            resizeObserver.observe(ref.current);
            return () => {
                resizeObserver.disconnect();
            };
        }
    }, []);

    const classnames = [
        getClR(props.className),
        getCl(!!props.loadMask, 'mask'),
        getCl(props.needBack, 'needBack'),
        getCl(props.loaded, 'loaded'),
    ].join(' ')

    return (
        <div className={`tile ${classnames}`} ref={mainRef}>
            <>
                {props.title &&
                    <div className="tileTitle">{props.title}</div>
                }
                <div className={`tile__inner`} style={{ height }}>
                    {/* <TileLoader loaded={props.loaded} /> */}
                    {props.loadMask &&
                        <div className="tile__loadMask">
                            {props.loadMask}
                        </div>
                    }
                    {props.loader &&
                        <div className="tile__loader"></div>
                    }
                    <div className="tile__body" ref={ref}>
                        {props.children}
                    </div>
                </div>
            </>
        </div>
    )
}

export default Tile;