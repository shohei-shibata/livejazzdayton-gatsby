const { 
		getAllCards,
    getAttachmentsByCardId
	} = require("../utils/trello.js");
const { markdownToHtml } = require("../utils/markdownParser");

/*
JUST FOR REFERENCE IN CASE NEEDED IN THE FUTURE
const boardIdLinksAnnouncements = "632d73dfc435890468f6a2fc";
*/

const listIdLinks = "632d10c84c2e6705be8d7a3f";

async function getLinks() {
		const cards = await getAllCards(listIdLinks);
    console.log("CARDS", cards)
    cards.sort((a, b) => {
      return new Date(a.due).getTime() - new Date(b.due).getTime();
    });
    return await Promise.all(cards.map(async (card, index) => {
      const attachments = await getAttachmentsByCardId(card.id);
      const name = card.name;
      const linkUrl = attachments[0] ? attachments[0].url : "Invalid URL";
      const description = card.desc;
      const dateUpdated = card.dateLastActivity;

      const formattedLink = {
          id: `link-${index}`,
          dateUpdated: dateUpdated,
          title: name,
          description: markdownToHtml(description),
          url: linkUrl
      }

      return formattedLink;
    }));

}

module.exports = {
  getLinks
}