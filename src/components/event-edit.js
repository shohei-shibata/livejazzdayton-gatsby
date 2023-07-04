import React, { useEffect, useRef, useState } from "react"
import mdToHtml from "../utils/md-to-html"
import htmlToMd from "../utils/html-to-md"

const DateTimeForm = ({dateTime, setDateTime, name}) => {
  const updateDateTime = (field, value) => {
    const year = field === "year" ? value : dateTime.getFullYear()
    const month = field === "month" ? value : dateTime.getMonth()
    const date = field === "date" ? value : dateTime.getDate()
    const hours = field === "hours" ? value : dateTime.getHours()
    const minutes = field === "minutes" ? value : dateTime.getMinutes()

    const newDateTime = new Date(year, month, date, hours, minutes)
    
    if (newDateTime instanceof Date && !isNaN(newDateTime.valueOf())) {
      return setDateTime(newDateTime)
    }
  }
  const currentYear = () => {
    const now = new Date()
    return now.getFullYear()
  }
  return (
    <>
      <label htmlFor={`${name}-year`}>
        Event Year:
        <input 
          type="number" 
          name={`${name}-year`} 
          value={dateTime ? dateTime.getFullYear() : currentYear()} 
          onChange={e => updateDateTime("year", e.target.value)}
        />
      </label>
      <label htmlFor={`${name}-month`}>
        Event Month:
        <select 
          name={`${name}-month`} 
          value={dateTime ? dateTime.getMonth() : 0} 
          onChange={e => updateDateTime("month", e.target.value)}
        >
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>
      </label>
      <label htmlFor={`${name}-date`}>
        <input 
          type="number" 
          name={`${name}-date`}
          value={dateTime ? dateTime.getDate() : 1} 
          onChange={e => updateDateTime("date", e.target.value)}
        />
      </label>
      <label htmlFor={`${name}-hour`}>
        Hours
        <input
          type="number"
          name={`${name}-hour`}
          value={dateTime ? dateTime.getHours() : 0}
          onChange={e => updateDateTime("hours", e.target.value)}
        />
      </label>
      <label htmlFor={`${name}-minutes`}>
        Minutes
        <input
          type="number"
          name={`${name}-minutes`}
          value={dateTime ? dateTime.getMinutes() : 0}
          onChange={e => updateDateTime("minutes", e.target.value)}
        />
      </label>
    </>
  )
}

const EventEditForm = ({eventData, setEventData}) => {
  const [ startDateTime, setStartDateTime ] = useState(eventData.start)
  const [ endDateTime, setEndDateTime ] = useState(eventData.end)
  const [ descriptionInMd, setDescriptionInMd ] = useState()

  useEffect(() => {
    async function descriptionToMd() {
      const md = await htmlToMd(eventData.description)
      setDescriptionInMd(md)
    }
    descriptionToMd()
  }, [eventData])

  const formRef = {
    imageUrl: useRef(eventData.imageUrl),
    title: useRef(eventData.title),
    locationName: useRef(eventData.locationName),
    artists: useRef(eventData.artists?.join(",")),
    description: useRef(eventData.description),
    eventUrl: useRef(eventData.eventUrl),
    ticketUrl: useRef(eventData.ticketUrl),
    start: useRef(eventData.start),
    end: useRef(eventData.end)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    const descriptionInHtml = await mdToHtml(formRef.description.current.value)
    console.log("update preview", formRef.description.current.value, descriptionInHtml)
    setEventData({
      imageUrl: formRef.imageUrl.current.value,
      title: formRef.title.current.value,
      locationName: formRef.locationName.current.value,
      artists: formRef.artists.current.value.split(','),
      description: descriptionInHtml,
      eventUrl: formRef.eventUrl.current.value,
      ticketUrl: formRef.ticketUrl.current.value,
      start: new Date(formRef.start.current.value),
      end: new Date(formRef.end.current.value)
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="imageUrl">
        Featured Image:
        <input type="url" name="imageUrl" ref={formRef.imageUrl} defaultValue={eventData.imageUrl}/>
      </label>
      <label htmlFor="title">
        Event Name:
        <input type="text" name="title" ref={formRef.title} defaultValue={eventData.title}/>
      </label>
      <label htmlFor="location">
        Location:
        <input type="text" name="locationName" ref={formRef.locationName} defaultValue={eventData.locationName}/>
      </label>
      <label htmlFor="artists">
        Artists (separate names with commas):
        <input type="text" name="artists" ref={formRef.artists} defaultValue={eventData.artists?.join(",")}/>
      </label>
      <label htmlFor="description">
        Event Description
        <textarea
          name="description"
          ref={formRef.description}
          defaultValue={descriptionInMd}
          rows="30"
        />
      </label>
      <h3>Event Start</h3>
      <input 
        htmlFor="start" 
        type="hidden" 
        value={startDateTime}
        ref={formRef.start}
      />
      <DateTimeForm
        dateTime={startDateTime}
        setDateTime={setStartDateTime}
        name="start"
      />
      <h3>Event End</h3>
      <input 
        htmlFor="start" 
        type="hidden" 
        value={endDateTime}
        ref={formRef.end}
      />
      <DateTimeForm
        dateTime={endDateTime}
        setDateTime={setEndDateTime}
        name="end"
      />
      <h3>Event Links</h3>
      <label htmlFor="eventUrl">
        Event Website:
        <input 
          type="url" 
          name="eventUrl"
          defaultValue={eventData.eventUrl}
          ref={formRef.eventUrl}
        />
      </label>
      <label htmlFor="ticketUrl">
        Ticket Link:
        <input 
          type="url" 
          name="ticketUrl"
          defaultValue={eventData.ticketUrl}
          ref={formRef.ticketUrl}
        />
      </label>
      <input type="submit" value="Update Preview"/>
    </form>
  )
}

export default EventEditForm