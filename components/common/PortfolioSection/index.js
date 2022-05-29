import React from 'react'
import PortfolioProjectItem from './PortfolioProjectItem'
import Fade from 'react-reveal/Fade'

const PortfolioSection = ({ projects = [] }) => {
  const renderProjects = () => projects.map(project => {
    const { title, description, skills, images } = project.frontmatter
    return (
      <Fade bottom key={title}>
        <PortfolioProjectItem
          title={title}
          description={description}
          skills={skills}
          images={images}
        />
      </Fade>
    )
  })

  return (
    <div className='portfolio-section-component'>
      <h1>Portfolio</h1>
      <p>A selection of cool stuff I have worked on.</p>
      {renderProjects()}
    </div>
  )
}

export default PortfolioSection