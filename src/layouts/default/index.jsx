import React from 'react'
import Header from '../../components/Header'
import { Preview } from '../../pages/postJob/steps'
import style from './style.module.scss'
import { selectModal } from '../../redux/modalSlice'
import { useSelector } from 'react-redux'

const DefaultLayout = ({ children }) => {
  const modal = useSelector(selectModal)
  return (
    <div>
      <Header />
      <div>{children}</div>
      {modal && <Preview />}
    </div>
  )
}

export default DefaultLayout
