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
    
    if (newDateTime instanceof Date && !isNaN(newDateTime.valueOf())) {
      setDateTime(newDateTime)
    }
  }
  const currentYear = () => {
    const now = new Date()
    return now.getFullYear()
  }
  const getDatesArray = () => {
    const month = dateTime.getMonth()
    const year = dateTime.getFullYear()
    const numDays = new Date(year, month + 1, 0).getDate()
    return [...Array(numDays+1).keys()].slice(1)
  }

  const datesArray = getDatesArray()
  
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
        <select
          type="number" 
          name={`${name}-date`}
          value={formData ? formData.date : 1} 
          onChange={e => updateDateTime("date", e.target.value)}
        >
          {datesArray.map(d => (
            <option key={`date-${d}`} value={d}>{d}</option>
          ))}
        </select> 
        ,
        <select 
          type="number" 
          name={`${name}-year`} 
          value={formData ? formData.year : currentYear()} 
          onChange={e => updateDateTime("year", e.target.value)}
        >
          <option value={currentYear()}>{currentYear()}</option>
          <option value={currentYear()+1}>{currentYear()+1}</option>
          <option value={currentYear()+2}>{currentYear()+2}</option>
        </select>
      </div>
      <div className={eventEditStyle.dateTimeFormTime}>
        <select
          type="number"
          name={`${name}-hour`}
          value={formData ? formData.hours : 7}
          onChange={e => updateDateTime("hours", e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        :
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
  const [ error, setError ] = useState({messages: []})

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
    locationAddress: useRef(eventData.locationAddress),
    artists: useRef(eventData.artists?.join(",")),
    description: useRef(eventData.description),
    websiteUrl: useRef(eventData.websiteUrl),
    ticketUrl: useRef(eventData.ticketUrl),
    start: useRef(eventData.start),
    end: useRef(eventData.end),
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (startDateTime > endDateTime) {
      setError({
        messages: ["Event end cannot be earlier than event start."]
      })
      setTimeout(() => {
        window.scrollTo({
          top: 300,
          behavior: 'smooth',
        })
      }, 100)
      return
    }
    const descriptionInHtml = await mdToHtml(formRef.description.current.value)
    setEventData({
      ...eventData,
      imageUrl: formRef.imageUrl.current.value,
      title: formRef.title.current.value,
      locationName: formRef.locationName.current.value,
      locationAddress: formRef.locationAddress.current.value,
      artists: formRef.artists.current.value.split(',').map(artist => artist.trim()),
      description: descriptionInHtml,
      start: new Date(formRef.start.current.value),
      end: new Date(formRef.end.current.value),
      websiteUrl: formRef.websiteUrl.current.value,
      ticketUrl: formRef.ticketUrl.current.value,
    })
    incrementStep()
  }
  return (
    <form onSubmit={handleSubmit} className={eventEditStyle.eventEditForm}>
      { error.messages.length > 0 && 
        <div className={eventEditStyle.error}>
          Error: 
          <ul className={eventEditStyle.errorMessagesList}>
            { error.messages?.map((message, index) => (
            <span >{message}</span>))
            }
          </ul>
        </div>
      }
      <label htmlFor="imageUrl">
        Featured Image Link:
        <input type="url" name="imageUrl" ref={formRef.imageUrl} defaultValue={eventData.imageUrl}/>
      </label>
      <label htmlFor="title">
        Event Name:
        <input type="text" name="title" ref={formRef.title} defaultValue={eventData.title}/>
      </label>
      <label htmlFor="locationName">
        Location Name:
        <input type="text" name="locationName" ref={formRef.locationName} defaultValue={eventData.locationName}/>
      </label>
      <label htmlFor="locationAddress">
        Location Address:
        <input type="text" name="locationAddress" ref={formRef.locationAddress} defaultValue={eventData.locationAddress}/>
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
        setDateTime={setStartDateTime}
        name="start"
      />
      <h3>Event End</h3>
      <input 
        htmlFor="end" 
        type="hidden" 
        value={endDateTime}
        ref={formRef.end}
      />
      <DateTimeForm
        dateTime={endDateTime}
        setDateTime={setEndDateTime}
        name="end"
      />
      <h3>Web Links</h3>
      <label htmlFor="websiteUrl">
        Event Website:
        <input 
          type="url" 
          name="websiteUrl"
          defaultValue={eventData.websiteUrl}
          ref={formRef.websiteUrl}
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