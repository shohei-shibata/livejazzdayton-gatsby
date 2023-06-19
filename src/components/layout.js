import React from "react"
import { Link } from "gatsby"
import "../css/style.css"
import "../css/typography.css"

const navItems = [
  {
    name: "Home",
    url: "/"
  },{
    name: "About",
    url: "/about"
  },{
    name: "Events",
    url: "/events"
  },{
    name: "Links",
    url: "/links"
  }, {
    name: "Contact",
    url: "/contact"
  }
]

const SignUp = () => (
  <form
    action="https://buttondown.email/api/emails/embed-subscribe/livejazzdayton"
    method="post"
    target="popupwindow"
    onsubmit="window.open('https://buttondown.email/livejazzdayton', 'popupwindow')"
    class="newsletter-signup-form"
  >
    <div class="input-group">
      <label for="bd-name">Name</label>
      <input type="text" name="metadata__name" id="bd-Name" class="input" required/>
    </div>
    <div class="input-group">
      <label for="bd-email">Email</label>
      <input type="email" name="email" id="bd-email" class="input" required/>
    </div>
    <input type="submit" value="Subscribe" class="btn"/>
  </form>
)

const Footer = () => (
  <footer id="site-footer">
  <div id="news-letter-signup">
    <div>
      <h1>Live Jazz in Your Inbox</h1>
      <p>Get email updates of upcoming events and important announcements</p>
    </div>
    <div>
      <SignUp/>
    </div>
  </div>
  <div id="footer-container">
    <small>© 2022 Shohei Shibata</small>
    <div class="footer-link-logos-container">
      <a class="footer-link-logos" href="https://github.com/shohei-shibata/livejazzdayton">
        <i class="fa-brands fa-github"></i>
      </a>
      <a class="footer-link-logos" href="https://www.linkedin.com/in/shohei-shibata-53867a41/">
        <i class="fa-brands fa-linkedin"></i>
      </a>
      <a class="footer-link-logos" href="https://www.upwork.com/freelancers/~0151a5896633235bcc">
        <iconify-icon icon="simple-icons:upwork"></iconify-icon>
      </a>

    </div>
  </div>
</footer>
)

const Layout = ({children}) => {
  return (
    <>
      <section id="banner" class="full-width">
        <div id="banner-text-container">
          <div id="banner-title" class="accent-font">Live Jazz Dayton</div>
          <div id="banner-subtitle">The place to find all the great live jazz events around Dayton OH!</div>
        </div>
        <nav>
          <div id="nav-container-desktop" class="nav-container">
            <ul>
              {navItems.map(item => (
                <li>
                  <Link to={item.url}>
                    <small>{item.name}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div id="nav-container-mobile" class="nav-container">
          <ul>
            {navItems.map(item => (
              <li>
                <Link to={item.url}>
                  <i class="fa-solid {{item.icon}}"></i>
                  <small class="mobile-nav-text">{item.name}</small>
                </Link>
              </li>
            ))}
            </ul>
          </div>
        </nav>
      </section>
      <main>{children}</main>
      <Footer/>
    </>
  )
}

export default Layout
