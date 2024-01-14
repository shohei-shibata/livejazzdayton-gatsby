import * as React from "react"
import Seo from "../components/seo"

const LinksPage = ({data}) => {
  const links = data?.allLink?.nodes
  console.log("Links", links)
  return (
    <>
      <h1>Links</h1>
    </>
  )
}

export default LinksPage

export const Head = () => <Seo title="Links"/>
