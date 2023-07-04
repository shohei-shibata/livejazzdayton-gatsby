import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'

const htmlToMd = async (html) => {
  console.log("htmlToMd")
  const md = await unified()
  .use(rehypeParse) // Parse HTML to a syntax tree
  .use(rehypeRemark) // Turn HTML syntax tree to markdown syntax tree
  .use(remarkStringify) // Serialize HTML syntax tree
  .process(html)

  return md.value
}

export default htmlToMd