require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const { getAnnouncements } = require("./src/data/announcements")
const { getEvents } = require('./src/data/events')
const { getLinks } = require('./src/data/links')

function createCustomNode(type, data, createNode, createContentDigest) {
  console.log("Creating", type, data.id)
  createNode({
    ...data,
    id: data.id,
    parent: null,
    children: [],
    internal: {
      type: type,
      contentDigest: createContentDigest(data),
    },
  })
}

exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  const events = await getEvents()
  events.map(event => 
    createCustomNode("Event", event, createNode, createContentDigest)
  )

  const announcements = await getAnnouncements()
  announcements.map(announcement => 
    createCustomNode("Announcement", announcement, createNode, createContentDigest)
  )

  const links = await getLinks()
  console.log("LINKS", links)
  links.map(link => 
    createCustomNode("Link", link, createNode, createContentDigest)
  )

};