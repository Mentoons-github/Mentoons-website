const EmployeeTestimonials = () => {
  return (
    <div className="bg-[url('/assets/Career/Desktop.png')] bg-cover bg-center bg-no-repeat min-h-screen py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-800">
          What Our Previous Employees <br/> Has to Say
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          <div className="w-full max-w-[24rem] transform transition-all duration-300 hover:scale-105">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <video 
                src={`${import.meta.env.VITE_STATIC_URL}static/Abhishek%20Testimonial.mp4`}
                className="w-full h-[20rem] object-cover"
                controls
                poster="/assets/Career/abhi.png"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">Abhishek</h3>
                <p className="text-gray-600">Team Member</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[24rem] transform transition-all duration-300 hover:scale-105">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <video 
                src={`${import.meta.env.VITE_STATIC_URL}static/Ayushi Testimonial.mp4`}
                className="w-full h-[20rem] object-cover"
                controls
                poster="/assets/Career/ayushi.png"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">Ayushi</h3>
                <p className="text-gray-600">Team Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeTestimonials
