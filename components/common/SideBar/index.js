import React from 'react'
import { Divider, Layout, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import Image from 'next/image'
import Fade from 'react-reveal/Fade'
import SocialLinkIcons from '../SocialLinkIcons'

const { Sider } = Layout

const SideBar = ({ collapsed }) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={280}
      collapsedWidth={0}
    >
      {collapsed || (
        <Fade>
          <div className={`side-bar-inner-container ${!collapsed ? 'fixed-container' : null}`}>
            <div className='profile-image-container'>
              <Image
                src='/images/profileImage.png'
                alt="profileImage"
                width={180}
                height={180}
              />
            </div>
            <p>Welcome to the internet home of <span className='name-text'>Konstantinos Kyrtsonis</span>. Programmer, Engineer and Amateur Philosopher.</p>
            <p>Feel free to look around, check out my portfolio, or get in touch.</p>
            <SocialLinkIcons />
            <Divider />
            <Button
              className='white-button'
              icon={<DownloadOutlined />}
              onClick={() => window.open("https://drive.google.com/file/d/1mSfBO1gQKzn8DB-I4yLoNeluX1TKnQec/view?usp=sharing", "_blank")}
            >
              Download Resume
            </Button>
            <Divider />
            <p className='side-bar-footer-text'>© 2022 Konstantinos Kirtsonis. All rights reserved.</p>
          </div>
        </Fade>
      )}
    </Sider>
  )
}

export default SideBar