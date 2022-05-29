import LandingPage from '../components/containers/LandingPage'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const Page = (props) => <LandingPage {...props} />
export default Page


export async function getStaticProps() {
  // Get files from the projects dir
  const files = fs.readdirSync(path.join('public/portfolioProjects'))

  // Get slug and frontmatter from projects
  const projects = files.map((filename) => {
    // Create slug
    const slug = filename.replace('.md', '')

    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(path.join('public/portfolioProjects', filename), 'utf-8')
    const { data: frontmatter } = matter(markdownWithMeta)

    return {
      slug,
      frontmatter,
    }
  })

  return {
    props: {
      projects: projects
    },
  }
}