import { Tag } from 'antd'
import React from 'react'
import Fade from 'react-reveal/Fade'

const SkillsSection = () => {

  return (
    <Fade bottom>
      <div className='skills-section-component'>
        <h1>Skills</h1>

        <h4>Technologies & Tools</h4>
        <p>
          Through hands-on engineering and continuous learning, I have practical experience with:
        </p>
        <div className='tags-container'>
          <Tag color="blue">Python</Tag>
          <Tag color="blue">C++</Tag>
          <Tag color="blue">TypeScript</Tag>
          <Tag color="blue">LLMs & Fine-tuning</Tag>
          <Tag color="blue">PyTorch</Tag>
          <Tag color="blue">TensorFlow</Tag>
          <Tag color="blue">Scikit-learn</Tag>
          <Tag color="blue">Hugging Face</Tag>
          <Tag color="blue">Docker</Tag>
          <Tag color="blue">SQL</Tag>
          <Tag color="blue">Parquet / Arrow</Tag>
          <Tag color="blue">IFC / BIM</Tag>
          <Tag color="blue">Three.js</Tag>
          <Tag color="blue">PowerBI</Tag>
        </div>
        <p>
          Applied to domains such as:
        </p>
        <div className='tags-container'>
          <Tag color="blue">Machine Learning & Deep Learning</Tag>
          <Tag color="blue">NLP & LLM Pipelines</Tag>
          <Tag color="blue">Computer Vision</Tag>
          <Tag color="blue">Construction-Tech / AEC</Tag>
          <Tag color="blue">Data Engineering</Tag>
          <Tag color="blue">Audio Signal Processing</Tag>
          <Tag color="blue">3D Building Information Modelling</Tag>
          <Tag color="blue">Performance Optimization</Tag>
        </div>

        <h4>Experience & Qualifications</h4>
        <p>
          I combine academic depth with industry practice—studying Data Science, Technology and Innovation at the University of Edinburgh (Top 15 worldwide in 2023) while working full-time as an AI Engineer:
        </p>
        <ul>
          <li>Currently at: Amberg Loglay AG, Switzerland</li>
          <li>Data Science, Technology and Innovation MSc — University of Edinburgh</li>
          <li>Data Science Bootcamp — Constructor University</li>
        </ul>
      </div>
    </Fade>
  )
}

export default SkillsSection
