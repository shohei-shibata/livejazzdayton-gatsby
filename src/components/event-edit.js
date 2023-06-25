import React, { useState } from "react"
import getGoogleQueryString from "../utils/googleQueryString"

const EventEditForm = ({eventData, setEventData}) => {
  const mergeDateTimeAndUpdate = (name, date, time) => {
    console.log(date, time, typeof time)
    let dateTime = new Date(date)
    console.log(dateTime)
    const hours = typeof time === "object" ? time.getHours() : time.split(":")[0]
    const minutes = typeof time === "object" ? time.getMinutes() : time.split(":")[1]
    console.log(hours, minutes)
    dateTime.setHours(hours, minutes)
    console.log("Valid Date?", dateTime instanceof Date, !isNaN(dateTime.valueOf()))
    if (dateTime instanceof Date && !isNaN(dateTime.valueOf())) {
      console.log("valid date...")
      return handleChange(name, dateTime)
    }
  }
  const handleChange = (name, value) => {
    console.log("handleChange", name, value)
    setEventData({
      ...eventData, [name]: value
    })
  }
  const handleSubmit = e => {
    e.preventDefault()
  }
  const dateToString = (date) => {
    const year = `${date.getFullYear()}`
    const month = date.getMonth() < 9 ? `0${date.getMonth()+1}` : `${date.getMonth()}`
    const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
    return `${year}-${month}-${day}`
  }
  const hoursMinutesToString = (date) => {
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
    const minutes = date.getMinutes() < 10 ? `${date.getMinutes()}0` : `${date.getMinutes()}`
    return `${hours}:${minutes}`
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="imageUrl">
        Featured Image:
        <input type="url" name="imageUrl" value={eventData?.imageUrl} onChange={e => handleChange(e.target.name, e.target.value)}/>
      </label>
      <label htmlFor="title">
        Event Name:
        <input type="text" name="title" value={eventData?.title} onChange={e => handleChange(e.target.name, e.target.value)}/>
      </label>
      <label htmlFor="start-date">
        Start Date:
        <input 
          type="date" 
          name="start-date" 
          value={dateToString(eventData?.start)} 
          onChange={e => mergeDateTimeAndUpdate("start", e.target.value, eventData.start)}
        />
      </label>
      <label htmlFor="start-time">
        Start Time:
        <input 
          type="time" 
          name="start-time" 
          value={hoursMinutesToString(eventData?.start)} 
          onChange={e => mergeDateTimeAndUpdate("start", eventData.start, e.target.value)}
        />
      </label>
      <label htmlFor="end-date">
        End Date:
        <input type="date" name="end-date" value={eventData?.end} onChange={e => handleChange(e.target.name, e.target.value)}/>
      </label>
      <label htmlFor="end-time">
        End Time:
        <input type="time" name="end-time" value={eventData?.end} onChange={e => handleChange(e.target.name, e.target.value)}/>
      </label>
      <label htmlFor="location">
        Location:
        <input type="text" name="locationName" value={eventData?.location?.name} onChange={e => handleChange(e.target.name, e.target.value)}/>
      </label>
      <label htmlFor="artists">
        Artists (separate names with commas):
        <input type="text" name="artists" value={eventData?.artists?.join(",")} onChange={e => handleChange(e.target.name, e.target.value.split(","))}/>
      </label>
      <label htmlFor="linkType">
        Link Type:
        <select type="url" name="linkUrl">
          <option value="">--Please Choose--</option>
          <option value="Ticket">Ticket</option>
          <option value="Facebook">Facebook</option>
          <option value="Website">Website</option>
        </select>
      </label>
      <label htmlFor="linkUrl">
        Link Url:
        <input type="url" name="linkUrl"/>
      </label>
      <input type="submit" value="Preview"/>
    </form>
  )
}

export default EventEditForm