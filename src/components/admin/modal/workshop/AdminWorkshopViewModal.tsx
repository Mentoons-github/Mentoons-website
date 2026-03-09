import { WorkshopCategory } from "@/pages/admin/workshop/addWorkshop/allWorkshops";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  data: WorkshopCategory;
}

const AdminWorkshopViewModal = ({ onClose, data }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
              {data.categoryName}
            </h2>
            <p className=" text-gray-500">{data.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-10 max-h-[80vh] overflow-y-auto">
          {/* CATEGORY DESCRIPTION */}
          <div>
            <p className="text-gray-600 text-lg whitespace-pre-line">
              {data.description}
            </p>
          </div>

          {/* WORKSHOPS */}
          {data.workshops?.map((workshop) => (
            <div
              key={workshop._id}
              className="border rounded-xl p-6 space-y-6 bg-gray-50"
            >
              {/* WORKSHOP NAME */}
              <div>
                <h3 className="text-2xl  font-semibold text-gray-800 inline-block border-b-2 border-black pb-">
                  {workshop.workshopName}
                </h3>
              </div>

              {/* WHY CHOOSE US */}
              {workshop.whyChooseUs?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">
                    Why Choose Us
                  </h4>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workshop.whyChooseUs.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-xl p-4 bg-white space-y-2"
                      >
                        <h5 className="font-semibold text-lg text-gray-800">
                          {item.heading}
                        </h5>
                        <p className=" text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AGE GROUPS */}
              {workshop.ageGroups?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                    Age Groups
                  </h4>

                  <div className="space-y-6">
                    {workshop.ageGroups.map((group, index) => (
                      <div
                        key={index}
                        className="border rounded-xl p-5 md:flex gap-6 bg-white"
                      >
                        {/* IMAGE */}
                        <img
                          src={group.image as string}
                          alt={group.ageRange}
                          className="w-full md:w-56 h-40 object-cover rounded-lg mb-4 md:mb-0"
                        />

                        {/* CONTENT */}
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg text-gray-800 mb-2">
                            Age Range: {group.ageRange}
                          </h5>

                          <p className=" text-gray-600 mb-4">
                            {group.serviceOverview}
                          </p>

                          {/* BENEFITS */}
                          {group.benefits?.length > 0 && (
                            <div className="space-y-3">
                              <h6 className="font-semibold text-gray-700 text-xl">
                                Benefits
                              </h6>

                              {group.benefits.map((benefit, i) => (
                                <div key={i} className="space-y-">
                                  <p className="text-lg font-medium text-gray-700 ">
                                    {benefit.title} :-
                                  </p>
                                  <p className="text- text-gray-600">
                                    {benefit.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminWorkshopViewModal;
