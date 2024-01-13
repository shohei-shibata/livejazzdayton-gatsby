import React from "react"

const EventCard = ({ event }) => {
  const {slug, title, start, end, imageUrl, artists, locationName} = event
  const startDate = new Date(start)
  const endDate = new Date(end)
  const badges = []
  const shortMonth = [
    "JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"
  ]
  const fullMonth = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "October", "November", "December"
  ]
  const shortDayOfWeek = [
    "SUN","MON","TUE","WED","THU","FRI","SAT"
  ]
  const fullDayOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ]
  const timeZoneOption = {timeZone: "America/New_York"}
  const fullDateString = `${new Intl.DateTimeFormat("en-US", {
    ...timeZoneOption, 
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(startDate)}`
  const getTimeString = (d) => (
    new Intl.DateTimeFormat("en-US", {
      ...timeZoneOption,
      hour: "numeric",
      minute: "numeric"
    }).format(d)
  )
  const startTimeString = getTimeString(startDate)
  const endTimeString = getTimeString(endDate)
  return (
    <a class="event-card" href={`/events/${ slug }`}>
      <div class="event-card-date">
        <div class="event-card-date-month">
          {shortMonth[startDate.getMonth()]}
        </div>
        <div class="event-card-date-date">
          {startDate.getDate()}
        </div>
        <div class="event-card-date-day">
          {shortDayOfWeek[startDate.getDay()]}
        </div>
      </div>
      <div class="event-card-grid-container">
        <div class="event-card-image">
          {imageUrl ? 
            <img src={ imageUrl } alt="Featured image for the event"/>
            : null 
          }
        </div>
        <div class="event-card-text">
          <h2>
            { title }
            { badges.map(badge => <span class="badge-small">{ badge }</span>) }
          </h2>
          <p>{`${fullDateString} from ${startTimeString} to ${endTimeString}`}</p>
          <div class="tags-container">
            { artists && artists.map(artist => <span class="tag">{ artist }</span>) }
          </div>
          <p>At { locationName }</p>
        </div>
      </div>
    </a>
  )
}

export default EventCard