import HeroSlider from "./components/HeroSlider"
import CategoriesSlider from './components/CategoriesSlider'
import ProductsGrid from './components/ProductsGrid'

import EspressoDeck from './components/EspressoDeck'

function Home() {
    return (
        <div className="">
            <HeroSlider />
            <CategoriesSlider />
            <EspressoDeck />
            <ProductsGrid />
        </div>
    )
}

export default Home
