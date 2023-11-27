import React, { FC, useEffect, useState } from 'react'
import { fetchSvgMarkup, getCl, getClR, getRawHtml } from '../../helper'
import './styles.scss';
import AppStore from '../../store/store';
import { observer } from 'mobx-react-lite';

interface Props {
  // name: string,
  className?: string
}

const Burger: FC<Props> = observer((props: Props) => {
  return (
    <div className={`burger ${getClR(props.className)} ${getCl(!!AppStore.ui.sidebar.isActive, 'active')}`} onClick={() => { AppStore.setSidebarActive() }}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
})

export default Burger