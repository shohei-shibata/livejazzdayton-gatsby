import React, { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

const CopyToClipboardButton = ({text}) => {
  const [ copied, setCopied ] = useState(false)
  const handleCopy = () => {
    setCopied(true)
    setTimeout(()=> {
      setCopied(false)
    }, 3000)
  }
  return (
    <CopyToClipboard
      text={text}
      onCopy={handleCopy}
    >
      <button 
        className="btn-secondary btn-copy-to-clipboard" 
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </CopyToClipboard>
  )
}

export default CopyToClipboardButton