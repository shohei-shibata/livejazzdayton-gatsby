import React from "react"
import BuyMeACoffeeButtonIcon from "../icons/bmc-button"
import { bmcButtonWrapper, bmcButton } from "./bmc-button.module.css"

const BuyMeACoffeeButton = () => (
  <div
    className={bmcButtonWrapper}
  >
    <a 
      className={bmcButton} 
      href="https://www.buymeacoffee.com/shohei_shibata" 
      target="_blank"
      rel="noreferrer"
    >
      <BuyMeACoffeeButtonIcon />
    </a>
  </div>
)

export default BuyMeACoffeeButton