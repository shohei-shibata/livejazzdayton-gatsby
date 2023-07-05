import React, { useEffect, useRef, useState } from "react"
import mdToHtml from "../utils/md-to-html"
import htmlToMd from "../utils/html-to-md"
import * as eventEditStyle from "./event-edit.module.css"

const DateTimeForm = ({dateTime, setDateTime, name}) => {
  const parseDateTime = (data) => {
    const pm = data.getHours() > 11
    return {
      year: data.getFullYear(),
      month: data.getMonth(),
      date: data.getDate(),
      hours: pm ? data.getHours() - 12 : data.getHours(),
      minutes: data.getMinutes().toString(),
      amPm: pm ? "PM" : "AM"
    }
  }

  const formData = parseDateTime(dateTime)

  const updateDateTime = (field, value) => {
    const year = field === "year" ? value : dateTime.getFullYear()
    const month = field === "month" ? value : dateTime.getMonth()
    const date = field === "date" ? value : dateTime.getDate()
    const hours = field === "hours" ? value : dateTime.getHours()
    const minutes = field === "minutes" ? value : dateTime.getMinutes()
    const isPm = field === "am-pm" && value === "PM" ? true : false

    const newDateTime = new Date(year, month, date, isPm ? hours + 12 : hours, minutes)

    console.log("newDateTime", newDateTime)
    
    if (newDateTime instanceof Date && !isNaN(newDateTime.valueOf())) {
      setDateTime(newDateTime)
    }
  }
  const currentYear = () => {
    const now = new Date()
    return now.getFullYear()
  }
  return (
    <div className={eventEditStyle.dateTimeForm}>
      <div className={eventEditStyle.dateTimeFormDate}>
        <select 
          name={`${name}-month`} 
          value={formData ? formData.month : 0} 
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
        <input 
          type="number" 
          name={`${name}-date`}
          value={formData ? formData.date : 1} 
          onChange={e => updateDateTime("date", e.target.value)}
        />
        <input 
          type="number" 
          name={`${name}-year`} 
          value={formData ? formData.year : currentYear()} 
          onChange={e => updateDateTime("year", e.target.value)}
        />
      </div>
      <div className={eventEditStyle.dateTimeFormTime}>
        <input
          type="number"
          name={`${name}-hour`}
          value={formData ? formData.hours : 7}
          onChange={e => updateDateTime("hours", e.target.value)}
        />
        <select
          name={`${name}-minutes`}
          value={formData ? formData.minutes : 0}
          onChange={e => updateDateTime("minutes", parseInt(e.target.value))}
        >
          <option value="0">00</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <select 
          value={formData ? formData.amPm : "PM"}
          onChange={e => updateDateTime("am-pm", e.target.value)}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  )
}

const EventEditForm = ({eventData, setEventData, incrementStep}) => {
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
    end: useRef(eventData.end),
    durationHours: useRef(Math.floor((endDateTime - startDateTime)/1000/60/60)),
    durationMinutes: useRef(((endDateTime - startDateTime)/1000/60) % 60)
  }
  const handleStartDateTimeChange = (newDateTime) => {
    setStartDateTime(newDateTime)
    handleDurationChange(newDateTime)
  }
  const handleDurationChange = (currentStartDateTime) => {
    const durationInMinutes = parseInt(formRef.durationHours.current.value*60) + parseInt(formRef.durationMinutes.current.value)
    const dt = new Date(currentStartDateTime)
    setEndDateTime(new Date(dt.setMinutes(currentStartDateTime.getMinutes() + durationInMinutes)))
  }

  console.log("end", endDateTime)
  const handleSubmit = async e => {
    e.preventDefault()
    const descriptionInHtml = await mdToHtml(formRef.description.current.value)
    setEventData({
      imageUrl: formRef.imageUrl.current.value,
      title: formRef.title.current.value,
      locationName: formRef.locationName.current.value,
      artists: formRef.artists.current.value.split(',').map(artist => artist.trim()),
      description: descriptionInHtml,
      eventUrl: formRef.eventUrl.current.value,
      ticketUrl: formRef.ticketUrl.current.value,
      start: new Date(formRef.start.current.value),
      end: new Date(formRef.end.current.value)
    })
    incrementStep()
  }
  return (
    <form onSubmit={handleSubmit} className={eventEditStyle.eventEditForm}>
      <label htmlFor="imageUrl">
        Featured Image Link:
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
        <input type="text" name="artists" ref={formRef.artists} defaultValue={eventData.artists?.join(", ")}/>
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
        setDateTime={handleStartDateTimeChange}
        name="start"
      />
      <h3>Duration</h3>
      <div className={eventEditStyle.duration}>
        <input
          htmlFor="durationHours"
          name="durationHours"
          type="number"
          defaultValue={Math.floor((endDateTime - startDateTime)/1000/60/60)}
          onChange={e => handleDurationChange(startDateTime)}
          ref={formRef.durationHours}
        />
        <span>:</span>
        <select
          htmlFor="durationMinutes"
          name="durationMinutes"
          type="number"
          defaultValue={((endDateTime - startDateTime)/1000/60) % 60}
          onChange={e => handleDurationChange(startDateTime)}
          ref={formRef.durationMinutes}
        >
          <option value="0">00</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
      </div>
      <input 
        htmlFor="start" 
        type="hidden" 
        value={endDateTime}
        ref={formRef.end}
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