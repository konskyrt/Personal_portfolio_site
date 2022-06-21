import React, { useState } from 'react'
import { Layout } from 'antd'
import Head from 'next/head'
import SideBar from '../../common/SideBar'
import SideBarToggleButton from '../../common/SideBarToggleButton'
import TypedIntroText from '../../common/TypedIntroText'
import PortfolioSection from '../../common/PortfolioSection'
import { Container, Row, Col } from 'react-bootstrap'
import TopNavBar from '../../common/TopNavBar'
import SkillsSection from '../../common/SkillsSection'
import ContactSection from '../../common/ContactSection'
import ParticlesBackground from '../../common/ParticlesBackground'

const { Header, Content } = Layout;

const LandingPage = ({ projects }) => {

  const [sidBarCollapsed, setSidBarCollapsed] = useState(true)

  return (
    <div className='landing-page-component'>
      <ParticlesBackground />
      <Head>
        <title>Konstantinos Kyrtsonis</title>
      </Head>
      <Layout>
        <SideBar collapsed={sidBarCollapsed} />
        <Layout className="landing-page-layout">
          <Header className="landing-page-header">
            <SideBarToggleButton
              collapsed={sidBarCollapsed}
              onClick={setSidBarCollapsed}
            />
            <TopNavBar />
          </Header>
          <Content
            style={{ minHeight: '100vh', backgroundColor: '#fff', padding: 30 }}
          >
            <Container>
              <Row className='intro-section' id='Home'>
                <TypedIntroText />
                <section className='intro-text-section'>
                  <p className='intro-text-heading'>Hey!</p>
                  <p className='intro-text-description'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tristique facilisis ipsum sed consequat. Nullam elementum nisl mauris, nec congue turpis faucibus eget. Vestibulum at arcu ac ante cursus eleifend. Vivamus quis eleifend erat. Integer in orci nibh. Proin pharetra ex eu rhoncus feugiat.
                    Nullam elementum nisl mauris, nec congue turpis faucibus eget. Vestibulum at arcu ac ante cursus eleifend. Vivamus quis eleifend erat. Integer in orci nibh. Proin pharetra ex eu rhoncus feugiat.
                  </p>
                </section>
              </Row>
              <Row className='protfolio-section' id='Portfolio'>
                <PortfolioSection projects={projects} />
              </Row>
              <Row className='skills-section' id='Skills'>
                <SkillsSection />
              </Row>
              <Row className='contact-section' id='Contact'>
                <ContactSection />
              </Row>
              <div className='spacer-bottom'></div>
            </Container>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default LandingPage
