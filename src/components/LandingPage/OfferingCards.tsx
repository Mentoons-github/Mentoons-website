type OfferingCardsProps = {
    title: string;
    description: string;
    image: string;
    color: string;
    signImage: string;
}
const OfferingCards = ({ title, description, image, color, signImage }: OfferingCardsProps) => {
    console.log(color,';;;;;;')
  return (
   <div className="relative">
    <div className={`bg-[${color}] rounded-xl p-4`}>
        <img src='/assets/LandingPage/star-bg.png' alt='star bg' className="w-full h-full absolute top-0 left-0" />
        <img src={image} alt={title} className="w-[80%] h-[80%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
   </div>
  )
}

export default OfferingCards
