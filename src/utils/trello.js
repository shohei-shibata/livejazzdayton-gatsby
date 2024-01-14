const fetch = require("node-fetch");
const { markdownToHtml } = require("./markdownParser");

const TRELLO_API_KEY = process.env.GATSBY_TRELLO_API_KEY;
const TRELLO_API_TOKEN = process.env.GATSBY_TRELLO_API_TOKEN;

const params = `key=${TRELLO_API_KEY}&token=${TRELLO_API_TOKEN}`;

const approvedEventsBoardId = "6325991c66402801560c94dd";

const getAllCards = async (listId) => {
	const url = `http://api.trello.com/1/lists/${listId}/cards?${params}&customFieldItems=true`
  const res = await fetch(url)
  const json = await res.json()
  return json
}

const getVenueAddressById = async (cardId) => {
	const url = `http://api.trello.com/1/cards/${cardId}/address?${params}`
	const res = await fetch(url)
  const json = await res.json()
  return json._value
}

const getVenueNameById = async (cardId) => {
	const url = `http://api.trello.com/1/cards/${cardId}/locationName?${params}`
	const res = await fetch(url)
  const json = res.json()
  return json._value
}

const getCustomFields = async (boardId) => {
  const url = `http://api.trello.com/1/boards/${boardId}/customFields?${params}`
	const res = await fetch(url)
  const json =  await res.json()
  if (json.length > 0) {
    return json.map(item => {
      return {
        name: item.name,
        id: item.id,
      };
    });
  } else {
    console.log("No Custom Field Data", res, json)
    return []
  }
}

const getAttachmentsByCardId = async (cardId) => {
	const url = `http://api.trello.com/1/cards/${cardId}/attachments?${params}`
	const res = await fetch(url)
  return await res.json();
}

const getCustomFieldByName = async (boardId, card, fieldName) => {
  const customFields = await getCustomFields(boardId);
  const customField = customFields.filter(item => {
    return item.name === fieldName
  });
  const idCustomField = customField.length > 0 ? customField[0].id : null;
  const customFieldFiltered = card.customFieldItems.filter(item => {
    return item.idCustomField === idCustomField
  });
  const customFieldValue = customFieldFiltered.length > 0 ?
    customFieldFiltered[0].value : null;
  const dateFields = ["Event Start", "Event End", "Published"];
  const isDate = dateFields.includes(fieldName);
  if (!customFieldValue) { return null };
  if (isDate) {
    return customFieldValue.date;
  } else if (fieldName === "Artists") {
    return customFieldValue.text.split(", ");
  } else {
    return customFieldValue.text;
  };
}

const parseEventCard = async card => {
  const trelloParsed = {
    cardId: card.id,
    name: card.name,
    description: markdownToHtml(card.desc),
    dateUpdated: card.dateLastActivity,
		imageId: card.cover.idAttachment,
    locationName: await getVenueNameById(card.id),
    locationAddress: await getVenueAddressById(card.id),
    start: await getCustomFieldByName(approvedEventsBoardId, card, "Event Start"),
    end: await getCustomFieldByName(approvedEventsBoardId, card, "Event End"),
    artists: await getCustomFieldByName(approvedEventsBoardId, card, "Artists"),
    links: {
      facebook: await getCustomFieldByName(approvedEventsBoardId, card, "Facebook"),
      website: await getCustomFieldByName(approvedEventsBoardId, card, "Website"),
      stream: await getCustomFieldByName(approvedEventsBoardId, card, "Stream Link"),
      tickets: await getCustomFieldByName(approvedEventsBoardId, card, "Tickets"),
    },
    streamEmbed: await getCustomFieldByName(approvedEventsBoardId, card, "Stream Embed")
  }
  return trelloParsed;
}

const getImageUrl = async (cardId, attachmentId) => {
  if (!attachmentId || !cardId) return null;
	const url = `http://api.trello.com/1/cards/${cardId}/attachments/${attachmentId}?${params}`;
	const res = await fetch(url)
  const json = await res.json()
  const imageUrl = json.url
	return `${imageUrl}?${params}`;
}

module.exports = {
	getAllCards,
	parseEventCard,
	getImageUrl,
  getAttachmentsByCardId,
  getCustomFieldByName,
}
