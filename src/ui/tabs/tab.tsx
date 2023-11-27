import React, { FC, ReactNode, useEffect, useState } from 'react'
import './styles.scss';
import { NavLink } from 'react-router-dom';
import { getCl } from '../../helper';

interface Props {
  active: boolean,
  onClick?: () => void,
  children: ReactNode,
  to?: string
}

const Tab: FC<Props> = (props: Props) => {
  const Tag = props.to ? NavLink : 'div'
  return (
    <Tag to={props.to || ''} className={`tab ${getCl(props.active, 'active')}`} onClick={props.onClick}>
      {props.children}
    </Tag>
  );
}

export default Tab