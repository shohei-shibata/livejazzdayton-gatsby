import React from "react"
import getGoogleQueryString from "../utils/googleQueryString"

const EventDetails = ({eventData}) => {
  const {imageUrl, title, slug, artists, description, start, end, locationName, locationAddress, eventUrl, ticketUrl} = eventData
  const GOOGLE_API_KEY = process.env.GATSBY_GOOGLE_API_KEY
  const eventDateString = start.toLocaleDateString("en-US", {timeZone: "America/New_York"})
  const today = new Date()
  const todayDateString = today.toLocaleDateString("en-US", {timeZone: "America/New_York"})
  const eventIsToday = eventDateString === todayDateString
  const startTimeString = start.toLocaleTimeString("en-US", {timeZone: "America/New_York"})
  const endTimeString = end.toLocaleTimeString("en-US", {timeZone: "America/New_York"})
  const calendarLinks = null // Need to add getCalendarLinks function
  const googleMapsUrl = `https://maps.google.com/maps?q=${getGoogleQueryString(`${locationName} ${locationAddress || "near Dayton, Ohio"}`)}`
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/search?q=${getGoogleQueryString(`${locationName} ${locationAddress || "near Dayton, Ohio"}`)}&key=${GOOGLE_API_KEY}`
  const links = [
    {
      name: "Event Link",
      url: eventUrl
    },{
      name: "Tickets",
      url: ticketUrl
    }
  ]

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
        At {locationName}
        <a href={googleMapsUrl}>{locationAddress}</a>
      </p>

      <div className="tags-container">
        {artists?.map(artist => (
          <span className="tag">{ artist === "" ? "Unknown Artist" : artist }</span>
        ))}
      </div>

      <div id="event-links-container">
        {/* Need to add calendar link */}
        {links?.map(link => (
          <a className="btn-secondary" href={link.url} style={!link.url ? {pointerEvents: "none", display: "none"} : {}}>
            {link.name}
          </a>
        ))}
      </div>

      <div dangerouslySetInnerHTML={{__html: description}}/>

      <div className="google-maps-container">
        <div className="google-maps-canvas">
          <iframe frameborder="0" src={googleMapsEmbedUrl} title="Google Maps Embed"/>
        </div>
      </div>

    </section>
  )
}

export default EventDetails