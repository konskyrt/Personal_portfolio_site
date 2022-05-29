import React from 'react'
import { Button, Carousel, Divider } from 'antd'
import Image from 'next/image'

const PortfolioProjectItem = ({ title, description, skills, link, images = [] }) => {
  return (
    <div className='portfolio-project-item-component'>
      <div className='portfolio-project-item-header'>
        <h2 className='title-text'>{title}</h2>
        {/*
        <Button className='white-button'>
          Notebook
        </Button>
        */}
      </div>
      <Divider />
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