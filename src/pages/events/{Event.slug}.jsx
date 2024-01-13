import React from "react"
import Seo from "../../components/seo"
import { Link, graphql } from "gatsby"
import EventDetails from "../../components/event-details"


export default function EventDetailsPage({data}) {
  const { event } = data
  console.log(event)
  return (
    <>
      <EventDetails eventData={event}/>
    </>
  )

}

export const query = graphql`
  query getEventDetails {
    event(slug: {
      eq: "sun-nov-05-2023-sinclair-youth-jazz-concert"
    }) {
      id
      imageUrl
      title
      slug
      artists
      description
      start
      end
      locationName
      locationAddress
    }
  }
`