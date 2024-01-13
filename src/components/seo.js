import React from "react"

const Seo = ({title}) => {
  const siteMeta = {
    title: "Live Jazz Dayton"
  }
  return (
  <>
    <title>{title ? `${siteMeta.title} | ${title}` : `${siteMeta.title}`}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com"/>
    <link href="https://fonts.googleapis.com/css2?family=Barlow&family=Rubik+Dirt&display=swap" rel="stylesheet"/>
    <script src="https://kit.fontawesome.com/d2a533daa7.js" crossOrigin="anonymous"/>
    <script src="https://code.iconify.design/iconify-icon/1.0.0/iconify-icon.min.js"/>
    <script src="/clipboard.min.js"/>
  </>
)}

export default Seo