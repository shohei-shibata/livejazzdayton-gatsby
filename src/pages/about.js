import * as React from "react"
import Seo from "../components/seo"
import AboutPageContent from "../content/about.mdx"

const AboutPage = () => {
  return (
    <>
      <h1>About This Website</h1>
      <AboutPageContent/>
    </>
  )
}

export default AboutPage

export const Head = () => <Seo title="About"/>
