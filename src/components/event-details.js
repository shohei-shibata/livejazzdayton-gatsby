import React from "react"
import getGoogleQueryString from "../utils/googleQueryString"

const EventDetails = ({eventData}) => {
  console.log("Event Details", eventData)
  const {imageUrl, title, slug, artists, links, description, start, end, location} = eventData
  const GOOGLE_API_KEY = process.env.GATSBY_GOOGLE_API_KEY
  const eventDateString = start.toLocaleDateString("en-US", {timeZone: "America/New_York"})
  const today = new Date()
  const todayDateString = today.toLocaleDateString("en-US", {timeZone: "America/New_York"})
  const eventIsToday = eventDateString === todayDateString
  const startTimeString = start.toLocaleTimeString("en-US", {timeZone: "America/New_York"})
  const endTimeString = end.toLocaleTimeString("en-US", {timeZone: "America/New_York"})
  const calendarLinks = null // Need to add getCalendarLinks function
  const googleMapsUrl = `https://maps.google.com/maps?q=${getGoogleQueryString(`${location.name} ${location.address || "near Dayton, Ohio"}`)}`
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/search?q=${getGoogleQueryString(`${location.name} ${location.address || "near Dayton, Ohio"}`)}&key=${GOOGLE_API_KEY}`

  return (
    <section id="event-details">
    <div id="event-featured-image">
        {imageUrl ? 
          <img src={ imageUrl } alt="Featured image for the event"/>
          : null 
        }
      </div>

      <h1>{ title } 
        <button 
          className="btn-secondary btn-copy-to-clipboard" 
          data-clipboard 
          data-clipboard-text={`https://livejazzdayton.com/events${ slug }`}
        >
          Copy Link
        </button>
      </h1>

      <h2>
        {eventDateString} from {startTimeString} to {endTimeString}
        {eventIsToday ? <span className="badge-small">Today</span> : null }
      </h2>

      <p>
        At {location.name}
        <a href={googleMapsUrl}>{location.address}</a>
      </p>

      <div className="tags-container">
        {artists?.map(artist => (
          <span className="tag">{ artist }</span>
        ))}
      </div>

      <div id="event-links-container">
        {/* Need to add calendar link */}
        {links?.map(link => (
          <a className="btn-secondary" href={link.url}>
            {link.name}
          </a>
        ))}
      </div>

      {description}

      <div className="google-maps-container">
        <div className="google-maps-canvas">
          <iframe frameborder="0" src={googleMapsEmbedUrl} title="Google Maps Embed"/>
        </div>
      </div>

    </section>
  )
}

export default EventDetails