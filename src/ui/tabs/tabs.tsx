import React, { FC, ReactNode, useEffect, useState } from 'react'
import './styles.scss';

interface Props {
  children: ReactNode;
}

const Tabs: FC<Props> = (props: Props) => {
  return (
    <div className='tabs'>
      {props.children}
    </div>
  );
}

export default Tabs