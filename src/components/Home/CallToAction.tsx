import CTAForm from "../common/CTAForm";

const CallToAction: React.FC = () => {
    return (
        <div
            className="w-full min-h-screen flex items-center justify-center py-10 px-4"
            style={{
                backgroundImage: `url('/cta.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="bg-white rounded-2xl max-w-[40rem] max-h-[90rem] lg:max-h-[69rem] w-full lg:w-3/4 ml-auto p-6 md:p-10 shadow-custom-light">
                <div className="text-center flex flex-col gap-5">
                    <h1 className="text-2xl font-extrabold text-[#ff3c00] md:text-3xl">"Let’s Revive"</h1>
                    <h2 className="text-xl font-bold md:text-2xl">OUR MEET UP GROUP</h2>
                    <p className="text-lg text-men-blue md:text-xl">Revival of Ancient Values, Respect, Care and Relationships.</p>
                    <p className="text-justify mt-4 font-medium">
                        In the heart of the city, there&apos;s a unique gathering called <span className="font-bold">"Let's Revive"</span> that brings people together to celebrate and bring back ancient values, especially the respect for elders. This group meets regularly in the local community center, where members of all ages share stories, learn from each other, and engage activities that highlight the wisdom and traditions of the past. Through discussions, workshops, and cultural events,<span className="font-bold">"Let's Revive"</span> fosters a sense of community and connection, reminding everyone of the importance of honoring those who have paved the way for us. It's a wonderful opportunity for people to connect with their roots, learn valuable lessons from the elderly, and ensure that these age-old values continue to enrich our lives today.
                    </p>
                    <h2 className="mt-4 text-xl font-bold md:text-2xl">JOIN US</h2>
                </div>
                <CTAForm />
            </div>
        </div>
    );
};

export default CallToAction;



