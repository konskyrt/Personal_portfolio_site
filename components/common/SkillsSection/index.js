import { Tag } from 'antd'
import React from 'react'
import Fade from 'react-reveal/Fade'

const SkillsSection = () => {

  return (
    <Fade bottom>
      <div className='skills-section-component'>
        <h1>Skills</h1>

        <h4>What I know</h4>
        <p>
          As a result of my perpetual curiosity, I have practical experience with a wide range of technologies including:
        </p>
        <div className='tags-container'>
          <Tag color="blue">Python</Tag>
          <Tag color="blue">Statistics</Tag>
          <Tag color="blue">Visualization</Tag>
          <Tag color="blue">Tableau</Tag>
          <Tag color="blue">Microsoft Office</Tag>
          <Tag color="blue">Data Mining</Tag>
          <Tag color="blue">SQL</Tag>
          <Tag color="blue">JAVA</Tag>
        </div>
        <p>
          For use with concepts such as:
        </p>
        <div className='tags-container'>
          <Tag color="blue">Data Analytics</Tag>
          <Tag color="blue">Machine Learning Algorithms</Tag>
          <Tag color="blue">Statistical Data Analysis</Tag>
          <Tag color="blue">Database Systems</Tag>
          <Tag color="blue">Information Modelling</Tag>
          <Tag color="blue">Data Visualization</Tag>
          <Tag color="blue">And More</Tag>
        </div>

        <h4>Certificates I have completed</h4>
        <p>
          To feed my hunger for learning, I do different Data Science courses and work independently on projects in my free time. Some of them include:
        </p>
        <ul>
          <li>Data Science Bootcamp from Schaffhausen Institute of Technology</li>
        </ul>
      </div>
    </Fade>
  )
}

export default SkillsSection