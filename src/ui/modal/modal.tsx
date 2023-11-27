import React, { FC, ReactNode, useEffect, useState } from 'react'
import { fetchSvgMarkup, fixWindow, getCl, getRawHtml } from '../../helper'
import './styles.scss';
import Icon from '../icon/icon';
import { observer } from 'mobx-react-lite';

interface IModal {
  isActive: boolean,
  children: ReactNode
  setActive?: (v: boolean) => void,
  isGlobal?: boolean,
  cantClose?: boolean,
  title?: string,
  needScroll?: boolean,
}

const Modal: FC<IModal> = observer((props: IModal) => {

  useEffect(() => {
    fixWindow(props.isActive)
  }, [props.isActive])

  const close = () => {
    if (!props.cantClose) {
      if (typeof props.setActive === 'function') {
        props.setActive(false)
      }
    }
  }

  const classnames = [
    getCl(props.isActive, 'active'),
    getCl(props.isGlobal, 'global'),
    getCl(props.needScroll, 'scroll'),
  ].join(' ')

  return (
    <div className={`modal ${classnames}`}>
      <div className='modal__shadow' onClick={close}></div>
      <div className='modal__inner'>
        {props.title &&
          <div className='modal__title'>{props.title}</div>
        }
        {!props.cantClose &&
          <div className='modal__close' onClick={close}>
            <Icon name='x' />
          </div>
        }
        <div className='modal__scroller'>
          <div className='modal__body'>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
})

export default Modal