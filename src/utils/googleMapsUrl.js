function generateGoogleMapsUrl(str) {
	const query =  str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "+")
		.replace(/^-+|-+$/g, "");

  return `https://maps.google.com/maps?q=${query}`
}

export default generateGoogleMapsUrl