import * as React from "react"
import Seo from "../components/seo"
import { Link, graphql } from "gatsby"
import EventCard from "../components/event-card"

const IndexPage = ({data}) => {
  const events = data.allEvent.nodes
  return (
    <>
      <section className="announcements-list">
        <h1>Announcements</h1>
      </section>

      <section class="events-list">
        <h1>Upcoming Events</h1>
        <p>Last Update:</p>
        {events.map(event => (
          <EventCard
            event={event}
          />
        ))}
          
        <div class="align-right">
          <Link to="/events">View All Events</Link>
        </div>

        <br/>

        <p>Do you know of an event that is not listed?
          <Link to="/events/add" className="btn btn-inline">Submit an Event</Link>
        </p>
      </section>
    </>
  )
}

export default IndexPage

export const Head = () => <Seo title="Home"/>

export const query = graphql`
  query getAllEvents {
    allEvent(sort: {start: ASC}) {
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
