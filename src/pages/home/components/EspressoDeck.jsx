import { useState } from 'react'
import { Check, ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import './EspressoDeck.css'

const media = '/espresso-deck/'
const configurations = [
  { label: '2 Group', image: 'two-group-black.jpeg' },
  { label: '3 Group', image: 'three-group-black.jpeg' },
]
const included = ['Free installation', 'On-demand grinder', 'Tamper box kit', 'Barista scale', '2 steaming jugs']

export default function EspressoDeck() {
  const [selected, setSelected] = useState(0)
  const configuration = configurations[selected]
  const orderLink = `https://wa.me/254795982056?text=${encodeURIComponent(`Hello Arobisca, I would like to order an Espresso Deck ${configuration.label} espresso station. Please share pricing and availability.`)}`

  return (
    <section id="espresso-deck" className="espresso-deck" aria-labelledby="deck-heading">
      <div className="deck-container">
        <div className="deck-intro">
          <span className="deck-eyebrow"><span aria-hidden="true" /> Now in Kenya</span>
          <p className="deck-distributor">Arobisca · Official Distributor of Espresso Deck in Kenya</p>
        </div>
        <div className="deck-layout">
          <div className="deck-showcase">
            <div className="deck-image-label"><span>ESPRESSO DECK</span><span>{configuration.label}</span></div>
            <img className="deck-product-image" src={media + configuration.image} alt={`Espresso Deck ${configuration.label} counterless espresso machine, front view`} loading="lazy" width="700" height="330" />
            <div className="deck-selector" role="group" aria-label="Choose your Espresso Deck configuration">
              {configurations.map((item, index) => (
                <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}<ArrowUpRight size={16} aria-hidden="true" /></button>
              ))}
            </div>
            <p className="deck-showcase-caption">Open by design. Made for connection.</p>
          </div>
          <div className="deck-details">
            <p className="deck-kicker">Meet Espresso Deck</p>
            <h2 id="deck-heading">Nothing between<br />you and your guest.</h2>
            <p className="deck-description">A counterless espresso bar for your café, hotel or restaurant. Its open design lets your guests watch every shot being made.</p>
            <p className="deck-config-note">Available in 2 Group and 3 Group configurations.</p>
            <div className="deck-package">
              <h3>Every Deck comes complete.</h3>
              <ul>{included.map(item => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
              <p>A complete espresso station, delivered and set up for you.</p>
            </div>
            <div className="deck-actions">
              <a className="deck-order" href={orderLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true" /> Order now <ArrowUpRight size={18} aria-hidden="true" /></a>
              <a className="deck-call" href="tel:+254795982056"><Phone size={17} aria-hidden="true" /><span>Call / WhatsApp<strong>0795 982 056</strong></span></a>
            </div>
            <a className="deck-group-link" href="https://www.arobiscagroup.com" target="_blank" rel="noopener noreferrer">www.arobiscagroup.com <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="deck-films-heading"><h3>See the Deck in action.</h3><p>A closer look at your next espresso station.</p></div>
        <div className="deck-films">
          <figure>
            <video controls playsInline preload="none" poster={media + 'three-group-white.jpeg'} aria-label="Espresso Deck product video"><source src={media + 'espresso-deck.mp4'} type="video/mp4" />Your browser does not support embedded video. <a href={media + 'espresso-deck.mp4'}>Download the Espresso Deck video</a>.</video>
            <figcaption><span>01 /</span> Discover Espresso Deck</figcaption>
          </figure>
          <figure>
            <video controls playsInline preload="none" poster={media + 'two-group-rear.jpeg'} aria-label="Coffee machine demonstration video"><source src={media + 'coffee-machine.mp4'} type="video/mp4" />Your browser does not support embedded video. <a href={media + 'coffee-machine.mp4'}>Download the coffee machine video</a>.</video>
            <figcaption><span>02 /</span> A closer look</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
