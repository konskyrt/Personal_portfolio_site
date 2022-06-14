import React from 'react'
import PortfolioProjectCategory from './PortfolioProjectCategory'
import PortfolioProjectItem from './PortfolioProjectItem'
import Fade from 'react-reveal/Fade'
import { Carousel } from 'react-bootstrap'
import IFC from '../IFC'

const PortfolioSection = ({ projects = [] }) => {

  const renderProjects = (category) => {
    const categoryProjects = projects.filter(p => p.frontmatter.category === category);
    return (
      <div>
        <Carousel variant="dark" interval={10000}>
          {categoryProjects.map(project => {
            const { title, description, skills, images, videos } = project.frontmatter
            return (
              <Carousel.Item key={title}>
                <PortfolioProjectItem
                  title={title}
                  description={description}
                  skills={skills}
                  images={images}
                  videos={videos}
                />
              </Carousel.Item>
            )
          })}
        </Carousel>
      </div>
    )
  }

  const renderIFCViewer = () => {
    return <IFC />
  }

  return (
    <div className='portfolio-section-component'>
      <Fade>
        <h1>Portfolio</h1>
        <p>A selection of cool stuff I have worked on.</p>
        <PortfolioProjectCategory
          title="Data Science Projects"
          description="Top data science projects I've worked on"
        >
          {renderProjects("CATEGORTY_THREE")}
        </PortfolioProjectCategory>
        <PortfolioProjectCategory
          title="3D BIM Programming"
          description="3D BIM development projects I have worked on"
        >
          {renderProjects("CATEGORTY_ONE")}
        </PortfolioProjectCategory>
        <PortfolioProjectCategory
          title="Ifc development"
          description="Ifc.js is an Opensource Javascript library to load, display and edit ifc models in the browser. The Ifc.js parsing engine is based on Webassembly and C++ and is specifically designed to read data from large files as fast as a desktop application"
        >
          {renderIFCViewer()}
        </PortfolioProjectCategory>
      </Fade>
    </div>
  )
}

export default PortfolioSection