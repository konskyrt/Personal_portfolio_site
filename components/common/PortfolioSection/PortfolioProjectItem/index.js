import React from 'react'
import { Carousel, Tag } from 'antd'
import Image from 'next/image'

const PortfolioProjectItem = ({ title, scope, description, details, skills, references, images = [], videos = [] }) => {

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

  const renderSkillTags = () => {
    if (!skills) return null
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean)
    return (
      <div className='project-skills-tags'>
        {skillList.map(skill => (
          <Tag key={skill} color="blue">{skill}</Tag>
        ))}
      </div>
    )
  }

  return (
    <div className='portfolio-project-item-component'>
      <div className='project-card-header'>
        <h2 className='project-title'>{title}</h2>
        {scope && <p className='project-scope'>{scope}</p>}
      </div>

      <div className='project-card-body'>
        <div className='project-section'>
          <h4 className='section-label'>Description</h4>
          <p className='section-content'>{description}</p>
        </div>

        {details && (
          <div className='project-section'>
            <h4 className='section-label'>Details</h4>
            <p className='section-content'>{details}</p>
          </div>
        )}

        {renderSkillTags()}

        {(images.length > 0 || videos.length > 0) && (
          <div className='project-media'>
            <Carousel autoplay fade>
              {renderVideos()}
              {renderImages()}
            </Carousel>
          </div>
        )}

        {references && (
          <div className='project-section project-references'>
            <h4 className='section-label'>References & Technologies</h4>
            <p className='section-content'>{references}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PortfolioProjectItem
