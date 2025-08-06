import Image from "next/image"
import Hero from "./Hero"
import TopTechList from "./TopTechList"
import Journey from "./Journey"
import Engineers from "./Engineers"
import Alumni from "./Alumni"
import Ready from "./Ready"
const Index = () => {
    return (
        <div>
            <Hero />
            <TopTechList />
            <Journey />
            <Engineers />
            <Alumni />
            <Ready />
        </div>
    )
}

export default Index