import React from 'react'
import Sidebar from './Sidebar'
import MainArea from './MainArea'
import Login from '../pages/Login'

const MainContainer = () => {
  return (
    <div className='relative bg h-[90vh] w-[90vw] bg-white rounded-3xl flex shadow-lg overflow-hidden'>
        {/* <Sidebar additionalClass='flex-[0.3]' />
        <MainArea additionalClass="flex-[0.7]"/> */}
        <Login />
    </div>
  )
}

export default MainContainer
