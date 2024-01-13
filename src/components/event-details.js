import React from "react"
import getGoogleQueryString from "../utils/googleQueryString"
import { htmlToText } from "html-to-text"
import getCalendarLinks from "../utils/getCalendarLinks"
import CopyToClipboardButton from "./button-copy-to-clipboard"

const EventDetails = ({eventData}) => {
  console.log("EVENT DETAILS", eventData)
  const {imageUrl, title, slug, artists, description, start, end, locationName, locationAddress, websiteUrl, ticketUrl} = eventData
  const isApproved = eventData.isApproved
  console.log("Approved?", isApproved)
  const GOOGLE_API_KEY = process.env.GATSBY_GOOGLE_API_KEY
  const startDateTime = new Date(start)
  const endDateTime = new Date(end)
  const eventDateString = startDateTime.toLocaleDateString("en-US", {timeZone: "America/New_York"})
  const today = new Date()
  const todayDateString = today.toLocaleDateString("en-US", {timeZone: "America/New_York"})
  const eventIsToday = eventDateString === todayDateString
  const startTimeString = startDateTime.toLocaleTimeString("en-US", {timeZone: "America/New_York"})
  const endTimeString = endDateTime.toLocaleTimeString("en-US", {timeZone: "America/New_York"})
  const googleMapsUrl = `https://maps.google.com/maps?q=${getGoogleQueryString(`${locationName} ${locationAddress || "near Dayton, Ohio"}`)}`
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/search?q=${getGoogleQueryString(`${locationName} ${locationAddress || "near Dayton, Ohio"}`)}&key=${GOOGLE_API_KEY}`

  const { googleCalendarLink, icsLink } = getCalendarLinks(title, start, end, locationAddress, htmlToText(description));

  const links = [
    {
      url: websiteUrl,
      name: "Event Website",
    },{
      url: ticketUrl,
      name: "Tickets",
    },{
      url: googleCalendarLink,
      name: "Google Calendar",
    },{
      url: icsLink,
      name: "iCal",
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
        <CopyToClipboardButton
          text={`https://livejazzdayton.com/events/${ slug }`}
        />
      </h1>

      <h2>
        {eventDateString} from {startTimeString} to {endTimeString}
        {eventIsToday ? <span className="badge-small">Today</span> : null }
      </h2>

      <p>
        At {locationName} { locationAddress && <a href={googleMapsUrl}>({locationAddress})</a> }
      </p>

      <div className="tags-container">
        {artists?.map((artist, index) => (
          <span key={`${artist}-${index}`} className="tag">{ artist === "" ? "Unknown Artist" : artist }</span>
        ))}
      </div>

      <div id="event-links-container">
        {/* Need to add calendar link */}
        {links?.map(link => (
          <a 
            key={`${link.name}-link`}
            className="btn-secondary" 
            href={link.url} 
            style={!link.url ? {pointerEvents: "none", display: "none"} : {}}
          >
            {link.name}
          </a>
        ))}
      </div>

      <div dangerouslySetInnerHTML={{__html: description}}/>

      <div className="google-maps-container">
        <div className="google-maps-canvas">
          <iframe src={googleMapsEmbedUrl} title="Google Maps Embed"/>
        </div>
      </div>

    </section>
  )
}

export default EventDetails