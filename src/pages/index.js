import * as React from "react"
import Seo from "../components/seo"
import { Link } from "gatsby"

const IndexPage = () => {
  return (
    <>
      <section className="announcements-list">
        <h1>Announcements</h1>
      </section>

      <section class="events-list">
        <h1>Upcoming Events</h1>
        <p>Last Update:</p>
          
        <div class="align-right">
          <Link to="/events"> View All Events</Link>
        </div>

        <br/>

        <p>Do you know of an event that is not listed?
          <a href="https://docs.google.com/forms/d/1NyrLlwjvzLAs2NoT3FGgvo0-WkU7SNp43AoPIaG0LPo/viewform" target="_blank" rel="noreferrer" className="btn btn-inline">Submit an Event</a>
        </p>
      </section>
    </>
  )
}

export default IndexPage

export const Head = () => <Seo title="Home"/>
