import React from 'react'
import { MenuOutlined } from '@ant-design/icons'

const SideBarToggleButton = ({ collapsed, onClick }) => {

  return (
    <div 
      className='side-bar-toggle-button'  
      onClick={() => onClick(_collapsed => !_collapsed)}
    >
      <div className={`side-bar-toggle-button ${collapsed ? 'light' : 'dark'}-side-bar-toggle-button`}>
        <MenuOutlined style={{ fontSize: 25 }} />
      </div>
    </div>
  )
}

export default SideBarToggleButton