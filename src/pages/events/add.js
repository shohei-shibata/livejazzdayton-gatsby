import React, { useState } from "react"
import Seo from "../../components/seo"
import ICAL from "ical.js"
import slugify from "../../utils/slugify"
import EventDetails from "../../components/event-details"

/* Event SCHEMA 

Event {
  slug: String!
  title: String!
  start: DateTime!
  end: DateTime
  location: Location!
  links: [Link]
  imageUrl: String
  artists: [String]
}

Location {
  name: String!
  address: String
}

Link {
  url: String!
  type: String
}

const eventFormatted = {
          slug: slug,
          dateUpdated: dateUpdated,
          title: name,
          start: start,
          end: end,
          location: {
              name: locationName,
              address: locationAddress
          },
          links: {
            googleCalendar: googleCalendar,
            ics: ics,
            facebook: links.facebook && links.facebook.length > 0 ? links.facebook : null,
            website: links.website && links.website.length > 0 ? links.website : null,
            stream: links.stream && links.stream.length > 0 ? links.stream : null,
            tickets: links.tickets && links.tickets.length > 0 ? links.tickets : null,
          },
          streamEmbed: links.streamEmbed && links.streamEmbed.length > 0 ? links.streamEmbed : null,
          badges: [
            isToday ? "Today" : null
          ],
          description: description,
          image: imageHtml,
          artists: artists,
          artistsString: artistsString,
          googleMapsUrl: `https://maps.google.com/maps?q=${queryString.replaceAll(" ", "+")}`,
          googleMapsEmbed: `https://www.google.com/maps/embed/v1/search?q=${queryString.replaceAll(" ", "+")}&key=${GOOGLE_API_KEY}`
      }

*/

const AddEventPage = () => {
  const [icalData, setIcalData] = useState()
  const [eventData, setEventData] = useState()
  const [isFilePicked, setIsFilePicked] = useState(false)
  const handleFileUpload = async e => {
    const file = e.target.files[0]
    const dataText = await file.text()
    const jcal = ICAL.parse(dataText)
    const comp = new ICAL.Component(jcal)
    const vevent = comp.getFirstSubcomponent("vevent")
    const eventData = new ICAL.Event(vevent)

    setIcalData({
      title: eventData.summary,
      start: eventData.startDate,
      end: eventData.endDate,
      location: eventData.location,
      description: eventData.description
    })
    setIsFilePicked(true)
    setEventData(parseIcalData({
      title: eventData.summary,
      start: eventData.startDate,
      end: eventData.endDate,
      location: eventData.location,
      description: eventData.description
    }))
  }
  const parseIcalData = (data) => {
    const start = new Date(Date.UTC(
      data.start._time.year, 
      data.start._time.month-1, 
      data.start._time.day, 
      data.start._time.hour, 
      data.start._time.minute
    ))
    const end = new Date(Date.UTC(
      data.end._time.year, 
      data.end._time.month-1, 
      data.end._time.day, 
      data.end._time.hour, 
      data.end._time.minute
    ))
    const slug = slugify(`${start.toDateString()} ${data.title}`)
    return {
      slug: slug,
      title: data.title,
      start: start, 
      end: end,
      location: {
          name: data.location,
      },
      description: data.description
    }
  }
  const handleSubmit = e => {
    alert("Submit", icalData)
  }
  const resetFileUpload = () => {
    setIcalData(null)
    setIsFilePicked(false)
  }
  console.log("eventData", eventData)
  return (
    <>
      <h1>Add an Event</h1>
      <h2>Upload an iCal file</h2>
      {isFilePicked ? 
        <>
          <p>File has been selected. See the preview below, and click "Submit Event" if everything looks OK.</p>
          <button onClick={resetFileUpload}>Choose another file</button>
        </>
        :
        <form>
          <input type="file" name="ical" onChange={handleFileUpload}/>
          <input type="submit" value="Upload" onSubmit={handleSubmit}/>
        </form>
      }
      <h2>Event Preview</h2>
      {eventData ? 
        <>
          <EventDetails
            imageUrl = {eventData.imageUrl}
            title = {eventData.title}
            slug = {eventData.slug}
            artists = {eventData.artists}
            links = {eventData.links}
            description = {eventData.description}
            start = {eventData.start}
            end = {eventData.end}
            location= {eventData.location}
          />

          <h2>Submit Event</h2>
          <p>Everything looks good? Click below to submit the event.</p>
          <p>NOTE: Event will appear on the website after an admin has reviewed and approved it.</p>
          <button onClick={handleSubmit}>Submit Event</button>
        </>
        :
        <p>No calendar data has been selected. Please use the form above to upload an iCal file.</p>
      }
    </>
  )
}

export default AddEventPage

export const Head = () => <Seo title="Add an Event"/>