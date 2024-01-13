import { google, ics } from "calendar-link"

function getCalendarLinks(title, start, end, address, description) {
  const event = {
    title: title,
    start: start,
    end: end,
    location: address,
    description: description,
  }
  return {
    googleCalendarLink: google(event),
    icsLink: ics(event)
  }
}

export default getCalendarLinks