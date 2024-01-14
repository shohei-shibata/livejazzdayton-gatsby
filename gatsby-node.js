require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const { getAnnouncements } = require("./src/data/announcements");
const { getEvents } = require('./src/data/events')

/*
const fauna = require('fauna');

const client = new fauna.Client({secret: process.env.FAUNA_SECRET_KEY})
const fql = fauna.fql;
const FaunaError = fauna.FaunaError;
*/

function createCustomNode(type, data, createNode, createContentDigest) {
  console.log("Creating ", type, data.slug, data.id)
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
  // fetch Trello data for events
  const events = await getEvents()
  events.map(event => 
    createCustomNode("Event", event, createNode, createContentDigest)
  )

  const announcements = await getAnnouncements()
  announcements.map(announcement => 
    createCustomNode("Announcement", announcement, createNode, createContentDigest)
  )

  // get data from GitHub API at build time
  /*const result = await fetch(`https://api.github.com/repos/gatsbyjs/gatsby`)
  try {
    const GET_ALL_EVENTS = fql`
      Events
        .where(.start > Time.now().toString())
        .order(asc(.start)) {
          id,
          slug,
          title,
          locationName,
          locationAddress,
          artists,
          start,
          end,
          imageUrl,
          description,
          websiteUrl,
          ticketUrl,
          isApproved
        }
    `
    const res = await client.query(GET_ALL_EVENTS)

    res.data.data.map(event => {
      createEventNode(event)
    })
  } catch (err) {
    if (err instanceof FaunaError) {
      console.log("FAUNA ERROR", err)
    }
  } finally {
    client.close();
  }
  */
};