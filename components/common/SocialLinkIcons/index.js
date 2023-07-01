import React from 'react'
import Fade from 'react-reveal/Fade'
import { GithubOutlined, LinkedinFilled, TwitterCircleFilled, FacebookFilled } from '@ant-design/icons'

const SocialLinkIcons = ({ isDarkIcons = false }) => {
  return (
    <Fade bottom delay={isDarkIcons ? 2500 : 0}>
      <div className='social-link-icons-component'>
        <div className={`social-acounts-container-${isDarkIcons ? 'dark' : 'light'}`}>
          <a href='https://www.linkedin.com/in/konstantinoskyrtsonis' target='_blank' rel='noreferrer'>
            <LinkedinFilled style={{ fontSize: 30 }} />
          </a>
          <a href='https://github.com/konskyrt' target='_blank' rel='noreferrer'>
            <GithubOutlined style={{ fontSize: 30 }} />
          </a>

        </div>
      </div>
    </Fade>
  )
}

export default SocialLinkIcons
