import Image from "next/image"
import Hero from "./Hero"
import TopTechList from "./TopTechList"
import Journey from "./Journey"
import Engineers from "./Engineers"
import Alumni from "./Alumni"
import Ready from "./Ready"
import HeaderForIndex from "./HeaderForIndex"
import Footer from "./Footer"
const Index = () => {
    return (
        <div>
            <HeaderForIndex />
            <Hero />
            <TopTechList />
            <Journey />
            <Engineers />
            <Alumni />
            <Ready />
            <Footer />
        </div>
    )
}

export default Index