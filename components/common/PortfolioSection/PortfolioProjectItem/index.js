import React from 'react'
import { Carousel } from 'antd'
import Image from 'next/image'

const PortfolioProjectItem = ({ title, description, skills, images = [], videos = [] }) => {

  const renderVideos = () => {
    return videos.map(videoUrl => (
      <iframe
        key={videoUrl}
        width={1000}
        height={600}
        src={videoUrl}
        frameBorder={0}
        allowFullScreen
      />
    ))
  }

  const renderImages = () => {
    return images.map(image => (
      <Image
        key={image}
        src={image}
        alt="image"
        width={2000}
        height={1100}
        objectFit='contain'
      />
    ))
  }

  return (
    <div className='portfolio-project-item-component'>
      <div className='portfolio-project-item-header'>
        <h2 className='title-text'>{title}</h2>
      </div>
      <p className='main-text'>{description}</p>
      <p className='sub-text'><b>Skills:</b> {skills}</p>
      <Carousel autoplay fade>
        {renderVideos()}
        {renderImages()}
      </Carousel>
    </div>
  )
}

export default PortfolioProjectItem