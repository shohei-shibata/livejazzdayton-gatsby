require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const { getTrelloEvents } = require('./src/utils/events')

const fauna = require('fauna');

const client = new fauna.Client({secret: process.env.FAUNA_SECRET_KEY})
const fql = fauna.fql;
const FaunaError = fauna.FaunaError;

function createEventNode(event, createNode, createContentDigest) {
  console.log("Creating Node for: ", event)
  createNode({
    ...event,
    id: event.slug,
    parent: null,
    children: [],
    internal: {
      type: `Event`,
      contentDigest: createContentDigest(event),
    },
  })
}

exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  // fetch Trello data for events
  const events = await getTrelloEvents()
  events.map(event => 
    createEventNode(event, createNode, createContentDigest)
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