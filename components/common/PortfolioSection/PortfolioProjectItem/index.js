import React from 'react'
import { Carousel } from 'antd'
import Image from 'next/image'

const PortfolioProjectItem = ({ title, description, skills, images = [] }) => {
  return (
    <div className='portfolio-project-item-component'>
      <div className='portfolio-project-item-header'>
        <h2 className='title-text'>{title}</h2>
      </div>
      <p className='main-text'>{description}</p>
      <p className='sub-text'><b>Skills:</b> {skills}</p>
      <Carousel autoplay fade>
        {images.map(image => (
          <Image
            key={image}
            src={image}
            alt="image"
            width={2000}
            height={600}
            objectFit='contain'
          />
        ))}
      </Carousel>
    </div>
  )
}

export default PortfolioProjectItem