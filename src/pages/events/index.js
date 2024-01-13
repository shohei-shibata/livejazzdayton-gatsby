import * as React from "react"
import Seo from "../../components/seo"
import { Link, graphql } from "gatsby"
import EventCard from "../../components/event-card"

const EventsPage = ({data}) => {
  const events = data.allEvent.nodes
  return (
    <>
      <h1>Events</h1>
      {events.map(event => (
        <EventCard
          event={event}
        />
      ))}
      <Link to="/events/add" className="btn btn-inline">Submit an Event</Link>
    </>
  )
}

export default EventsPage

export const Head = () => <Seo title="Events" />

export const query = graphql`
  query getAllEvents {
    allEvent(
      sort: {start: ASC}
    ) {
      nodes {
        id
        title
        slug
        start
        end
        imageUrl
        locationName
        artists
      }
    }
  }
`

