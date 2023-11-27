import React, { FC, useEffect, useState } from 'react'
import { fetchSvgMarkup, getCl, getClR, getRawHtml } from '../../helper'
import './styles.scss';
import AppStore from '../../store/store';
import Icon from '../icon/icon';
import { observer } from 'mobx-react-lite';

interface Props {
  // name: string,
  className?: string
}

const ThemeSwitcher: FC<Props> = observer((props: Props) => {
  return (
    <div className={`themeSwitcher ${getClR(props.className)} ${getCl(!!AppStore.ui.theme, AppStore.ui.theme)}`} onClick={() => { AppStore.changeTheme() }}>
      <div className="themeSwitcher__box">
        <Icon name="sun" className="sun" />
        <Icon name="moon" className="moon" />
      </div>
    </div>
  );
})

export default ThemeSwitcher