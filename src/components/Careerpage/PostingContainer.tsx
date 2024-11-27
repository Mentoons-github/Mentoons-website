import { useState } from "react"
import Postings from "./Postings"
import { IoChevronBack } from "react-icons/io5"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { Button } from "../ui/button"
import { JobApplicationForm } from "../shared/FAQSection/FAQCard"
import { FaTimes } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"

const PostingContainer = () => {
    const navigate = useNavigate()
    const { getToken } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPosting, setSelectedPosting] = useState<string | null>(null)
    const openPositions = useSelector((state: RootState) => state.career.openPositions);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false)

    const selectedPosition = openPositions.find(
        (position) => position.jobTitle === selectedPosting
    );

    const handlePostingClick = (postingTitle: string) => {
        setSelectedPosting(postingTitle)
        setIsModalOpen(true)
    }

    return (
        <div className="flex flex-col gap-10">
            {openPositions.map((position) => (
                <Postings
                    key={position._id}
                    title={position.jobTitle}
                    onClick={() => handlePostingClick(position.jobTitle)}
                />
            ))}

            {isModalOpen && selectedPosition && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    {isFormOpen ? (
                        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-14 relative">
                            <div className="absolute top-4 right-4 z-10 hover:scale-110 transition-transform bg-gradient-to-b from-[#60C6E6] to-[#3D8196] max-w-fit">
                                <FaTimes
                                    onClick={() => setIsFormOpen(false)}
                                    className="text-white text-xl md:text-2xl lg:text-3xl cursor-pointer "
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row items-center justify-center gap-4">
                                    <figure className="w-20 h-20">
                                        <img
                                            src="/assets/Career/form-icon.png"
                                            alt="form icon"
                                            className="w-full h-full object-contain"
                                        />
                                    </figure>
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                                            {selectedPosition.jobTitle}
                                        </h1>
                                        <p className="text-sm md:text-base lg:text-lg text-black/50">
                                            Fill in the details below and we'll contact you
                                        </p>
                                    </div>
                                </div>
                                <JobApplicationForm id={selectedPosition._id} />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[url('/assets/Career/posting-bg.png')] bg-cover bg-center w-full max-w-4xl max-h-[90vh] rounded-sm relative">
                            <IoChevronBack
                                onClick={() => setIsModalOpen(false)}
                                className="text-white text-2xl md:text-3xl lg:text-4xl cursor-pointer absolute top-4 left-4 z-10 hover:scale-110 transition-transform"
                            />

                            <div className="p-6 md:p-12 lg:p-16 overflow-y-auto max-h-[90vh]">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                                    {/* Content Column */}
                                    <div className="flex-1">
                                        <div className="text-center md:text-left">
                                            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white">
                                                {selectedPosition.jobTitle}
                                            </h1>
                                            <div className="flex flex-wrap gap-2 md:gap-4 mt-3 justify-center md:justify-start">
                                                <span className="bg-white/20 px-3 py-1 rounded-full text-white text-xs md:text-sm">
                                                    {selectedPosition.jobType}
                                                </span>
                                                <span className="bg-white/20 px-3 py-1 rounded-full text-white text-xs md:text-sm">
                                                    {selectedPosition.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-white mt-6">
                                            <h2 className="text-base md:text-lg lg:text-xl font-bold">Description</h2>
                                            <p className="text-sm md:text-base lg:text-lg mt-2">
                                                {selectedPosition.jobDescription}
                                            </p>
                                        </div>

                                        <div className="text-white mt-6">
                                            <h2 className="text-base md:text-lg lg:text-xl font-bold">Required Skills</h2>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedPosition.skillsRequired.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-white/10 px-3 py-1.5 rounded-lg text-xs md:text-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full mt-6 bg-white text-black hover:bg-white/80"
                                            onClick={async () => {
                                                const token = await getToken();
                                                if (!token) {
                                                    navigate("/sign-in")
                                                }
                                                else {
                                                    setIsFormOpen(true)
                                                }
                                            }}
                                        >
                                            Apply Now
                                        </Button>
                                    </div>

                                    {/* Image Column */}
                                    <div className="lg:w-1/3">
                                        <img
                                            src={selectedPosition.thumbnail}
                                            alt="position illustration"
                                            className="w-24 md:w-40 lg:w-full max-w-[280px] object-contain opacity-80 transition-all duration-300 hover:opacity-100 mx-auto lg:mx-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default PostingContainer
