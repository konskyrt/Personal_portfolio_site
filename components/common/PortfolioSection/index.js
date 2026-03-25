import React from 'react'
import PortfolioProjectCategory from './PortfolioProjectCategory'
import { Tabs } from 'antd'
import PortfolioProjectItem from './PortfolioProjectItem'

const { TabPane } = Tabs

const PortfolioSection = ({ projects = [] }) => {

  const renderProjects = (category) => {
    const categoryProjects = projects.filter(p => p.frontmatter.category === category);
    return (
      <div className='project-list'>
        {categoryProjects.map(project => {
          const { title, scope, description, details, skills, references, images, videos } = project.frontmatter
          return (
            <PortfolioProjectItem
              key={title}
              title={title}
              scope={scope}
              description={description}
              details={details}
              skills={skills}
              references={references}
              images={images}
              videos={videos}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className='portfolio-section-component'>
      <h1>Portfolio</h1>
      <p>A selection of AI engineering, data science, and construction-tech projects.</p>
      <br />
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="AI & Data Science" key="1">
          <PortfolioProjectCategory
            title="AI & Data Science"
            description="Machine learning, NLP, computer vision, and data-driven solutions for industry"
          >
            {renderProjects("CATEGORTY_THREE")}
          </PortfolioProjectCategory>
        </TabPane>
        <TabPane tab="BIM & 3D Engineering" key="2">
          <PortfolioProjectCategory
            title="BIM & 3D Engineering"
            description="3D modelling automation, IFC development, and BIM programming projects"
          >
            {renderProjects("CATEGORTY_ONE")}
          </PortfolioProjectCategory>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default PortfolioSection
