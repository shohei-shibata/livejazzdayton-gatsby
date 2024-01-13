import React, { useState } from "react"
import Seo from "../../components/seo"
import ICAL from "ical.js"
import slugify from "../../utils/slugify"
import EventDetails from "../../components/event-details"
import EventEditForm from "../../components/event-edit"
import mdToHtml from "../../utils/md-to-html"
import axios from "axios"

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
  const [eventData, setEventData] = useState()
  const [step, setStep] = useState(1)
  const [submitError, setSubmitError] = useState()

  const handleFileUpload = async e => {
    const file = e.target.files[0]
    const dataText = await file.text()
    const jcal = ICAL.parse(dataText)
    const comp = new ICAL.Component(jcal)
    const vevent = comp.getFirstSubcomponent("vevent")
    const data = new ICAL.Event(vevent)
    const descriptionInHtml = await mdToHtml(data.description)
    setEventData(parseIcalData({
      title: data.summary,
      slug: data.slug,
      start: data.startDate,
      end: data.endDate,
      locationAddress: data.location,
      description: descriptionInHtml
    }))
    nextStep()
  }
  const scrollToTop = () => {
    setTimeout(() => {
        window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }, 100)
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
      locationAddress: data.locationAddress,
      description: data.description
    }
  }
  const resetFileUpload = () => {
    scrollToTop()
    setEventData(null)
    setStep(1)
  }
  const nextStep = () => {
    if (step < 3) {
      setStep(step+1)
      scrollToTop()
    } else {
      setStep(1)
      scrollToTop()
    }
  }
  const prevStep = () => {
    if (step > 1) {
      setStep(step-1)
      scrollToTop()
    } 
  }
  const handleEventSubmit = e => {
    axios.post("/.netlify/functions/create-event", {
      ...eventData,
      approved: false,
    })
      .then(result => {
        if (result.status !== 200) {
          console.error("Error creating event")
          console.error(result)
          setSubmitError({
            message: result
          })
          return
        }
        console.log("Event Created Successfully", result)
        //resetFileUpload()
      })
  }
  return (
    <>
      <h1>Add an Event</h1>

      {submitError ? 
        <>
          <p>Error: {submitError.message}</p>
        </>: null}

      {step === 1 ? 
        <>
          <h2 id="upload">1. Upload an iCal file</h2>
          <form>
            <input type="file" name="ical" onChange={handleFileUpload}/>
          </form>
        </>
      : null}
      {step === 2 ? 
        <>
          <h2 id="edit">2. Edit Event Details</h2>
          <EventEditForm 
            eventData={eventData} 
            setEventData={setEventData}
            incrementStep={nextStep}
          />
          <button onClick={resetFileUpload}>Choose another file</button>
        </>
      : null}
      {step === 3 ? 
        <>
          <h2 id="preview">3. Preview Event Content And Submit</h2>
          <EventDetails
            eventData = {eventData}
          />
          <p>If you want to make further changes, click below.</p>
          <button onClick={prevStep}>Back to Event Edit Form</button>
          <h2 id="submit">Submit Event</h2>
          <p>Everything looks good? Click below to submit the event.</p>
          <button onClick={handleEventSubmit}>Submit Event</button>
          <p>NOTE: Event will appear on the website only after an admin has reviewed and approved it.</p>
        </>
      : null}
    </>
  )
}

export default AddEventPage

export const Head = () => <Seo title="Add an Event"/>