import React from 'react'
import Fade from 'react-reveal/Fade'

const ContactSection = () => {
  return (
    <Fade bottom>
      <div className='contact-section-component'>
        <h1>Contact</h1>
        <p>Have work opportunities? Want to collaborate on a project? Need advice? Or maybe grab some coffee?</p>
        <p>You can shoot an email to <a href='mailto:kyrkost@outlook.com'>kyrkost@outlook.com</a></p>
      </div>
    </Fade>
  )
}

export default ContactSection