import React, { useState } from "react"
import Seo from "../../components/seo"
import ICAL from "ical.js"

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
  const [IcalData, setIcalData] = useState()
  const [isFilePicked, setIsFilePicked] = useState(false)
  const reader = new FileReader()
  const handleFileUpload = async e => {
    const file = e.target.files[0]
    const dataText = await file.text()
    const jcal = ICAL.parse(dataText)
    const comp = new ICAL.Component(jcal)
    console.log("COMP", comp)
    const vevent = comp.getFirstSubcomponent("vevent")
    console.log("VEVENT", vevent)
    const summary = vevent.getFirstPropertyValue("summary");
    console.log("Summary", summary)
    const eventData = new ICAL.Event(vevent)
    console.log("Event data", eventData.summary)
    setIcalData({
      title: eventData.summary,
      startDateTime: eventData.startDate,
      endDateTime: eventData.endDate,
      location: eventData.location,
      description: eventData.description
    })
    //setIsFilePicked(true)
  }
  const handleSubmit = e => {
    alert("Submit", IcalData)
  }
  const resetFileUpload = () => {
    setIcalData(null)
    setIsFilePicked(false)
  }
  console.log("data", IcalData)
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
      {IcalData ? 
        <>
          <p>Show iCal Data</p>
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