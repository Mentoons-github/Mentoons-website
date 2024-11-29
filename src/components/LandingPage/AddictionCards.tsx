interface AddictionCardsProps {
    title: string;
    description: string;
    image: string;
    background: string;
    gradient: string;
    text: string;
}

const AddictionCards = ({ title, description, image, background, gradient, text }: AddictionCardsProps) => {
    return (
        <div className="w-full rounded-lg shadow-lg relative" style={{ background: background }}>
            <div className="flex items-center justify-between gap-4 pb-10 lg:pb-0">
                <figure>
                    <img src={image} alt={title} />
                </figure>
                <div className="p-4">
                    <p className="text-sm">{description}</p>
                </div>
            </div>
            <div className="p-4 rounded-b-lg absolute bottom-0 w-full" style={{ background: gradient }}>
                <h1 className="text-2xl font-bold" style={{ color: text }}>{title}</h1>
            </div>
        </div>
    )
}

export default AddictionCards
