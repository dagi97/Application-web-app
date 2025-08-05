import Button from "./Button"
const Hero = () => {
    return (
        <>
            <div className='relative'>
                <div
                    className="relative after:absolute after:inset-0 after:bg-[#1F2937] after:mix-blend-soft-light brightness-75"
                >
                    <img
                        src="/diverse-group-of-students-working-together.jpg"
                        alt="Diverse group of students working together"
                        className="h-[450px] sm:h-96 w-full object-cover"
                    />
                </div>
                <div className='absolute top-0 left-0 text-white mt-10 center
                
                ml-14 sm:ml-24'>
                    <h2 className='font-bold text-[50px] tracking-[1.5px]
                    
                    '>Forge Your Future in Tech</h2>
                    <p className='max-w-[500px] mb-[20px] text-xl'>
                        Join an elite community of Africa's
                        brightest minds, and get fast-tracked
                        to a software engineering career at
                        the world's leading tech companies.
                    </p>

                    {/* BUTTON HERE */}
                    <button className="py-3 px-8 bg-[#4338CA] rounded-md font-medium text-base">Start Your Application</button>
                    {/* <Button className="py-3 px-8 bg-[#4338CA] rounded-md">Start Your Application</Button> */}

                </div>
            </div >


        </>
    )
}

export default Hero