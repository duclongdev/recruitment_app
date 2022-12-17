import React from 'react'
import style from './style.module.scss'
import clsx from 'clsx'
const Button = ({ title, type, onClick, className, disable, contrast, fullWidth }) => {
  return (
    <button
      className={clsx(style.button, className, {
        [style.disable]: disable,
        [style.contrast]: contrast,
        [style.fullWidth]: fullWidth,
      })}
      type={type}
      onClick={onClick}
    >
      <span style={{ fontWeight: '700', fontSize: '1rem' }}>{title}</span>
    </button>
  )
}

export default Button
