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
          <Tag color="blue">C++</Tag>
          <Tag color="blue">Julia</Tag>
          <Tag color="blue">3D Models</Tag>
          <Tag color="blue">Statistics</Tag>
          <Tag color="blue">Neural Networks</Tag>
          <Tag color="blue">PowerBI</Tag>
          <Tag color="blue">Tableau</Tag>
          <Tag color="blue">Data Mining</Tag>
          <Tag color="blue">SQL</Tag>
          <Tag color="blue">Microsoft Office</Tag>
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

        <h4>Qualifications</h4>
        <p>
          To feed my hunger for learning, I study the Data Science Technology and Innovation postgraduate Program part time (Top 15 worldwide in 2023), while working as a Data Scientist full-time. I have also participated in Kaggle competitions and hackathons, and work independently on projects in my free time:
        </p>
        <ul>
          <li>Amberg Loglay AG</li>
          <li>Data Science, Technology and Innovation MSc at the University of Edinburgh</li>
          <li>Data Science Bootcamp from Constructor University</li>
        </ul>
      </div>
    </Fade>
  )
}

export default SkillsSection
