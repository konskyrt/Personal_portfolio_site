import { Button } from 'antd'
import React from 'react'

const PortfolioProjectCategory = ({ title, description, children  }) => {
  return (
    <div className='portfolio-project-category-component'>
      <h1 className='category-heading'>{title}</h1>
      <h2 className='category-sub-heading'>{description}</h2>
      <Button className='primary-button' onClick={() => window.open("https://github.com/konskyrt", "_blank")}>
        Github
      </Button>
      {children}
    </div>
  )
}

export default PortfolioProjectCategory