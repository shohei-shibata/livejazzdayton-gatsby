const fauna = require('fauna');

const client = new fauna.Client({
  secret: process.env.FAUNA_SECRET_KEY
})

const fql = fauna.fql;
const FaunaError = fauna.FaunaError;

exports.handler = async function createEvent({body}) {
  console.log("BODY", JSON.parse(body))
  const { 
    title,
    slug,
    imageUrl,
    locationName,
    locationAddress,
    artists,
    description,
    links,
    start,
    end,
    websiteUrl,
    ticketUrl,
  } = JSON.parse(body)

  const event = {
    title,
    slug,
    imageUrl,
    locationName,
    locationAddress,
    artists,
    links,
    start,
    end,
    websiteUrl,
    ticketUrl,
    description: description.toString(),
  }

  try {
    const CREATE_EVENT = fql`
      Events.create(${event}) {
        id,
        ts,
        slug
      }
    `
    const res = await client.query(CREATE_EVENT)
    console.log("FAUNA QUERY RESULT", res)
    return {
      statusCode: 200,
      body: JSON.stringify({ createdEvent: res.data })
    };
  } catch (err) {
    if (err instanceof FaunaError) {
      console.log("FAUNA ERROR", err)
      return {
        statusCode: 500,
        body: {
          error: "Failed to write event data to the database"
        }
      };
    }
  } finally {
    client.close();
  }

  /*const { slug, name, comment } = JSON.parse(event.body);
  const date = new Date().toString();
  const { data, errors } = await query(
    CREATE_COMMENT, { slug, date, name, comment });
 
  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors)
    };
  }*/

  /*const res = await fetchEmailRecipients();
  const { recipients } = JSON.parse(res.body);

  const deployContext = process.env.DEPLOY_CONTEXT;

  const templateId = deployContext === "PRODUCTION" ? 1 : 2;

  const { emailData, emailErrors } = await email({ 
    slug, name, comment, recipients, templateId
  })

  if (emailErrors) {
    return {
      statusCode: 500,
      body: JSON.stringify(emailErrors)
    }
  }*/
 
  //console.log("Email sent successfully", emailData)

};