import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axios from "axios";
import LoadingModal from "@/components/common/loginModal";
import {
  getEmployeeById,
  createEmployee,
  updateEmployee,
} from "../../redux/admin/employee/api";
import { AppDispatch, RootState } from "@/redux/store";
import { EmployeeFormData } from "@/types/employee";
import { errorToast, successToast } from "@/utils/toastResposnse";
import ProfilePictureUpload from "@/components/admin/employee/profilePictureUpload";
import PersonalInformation from "@/components/admin/employee/personalInfo";
import EmploymentDetails from "@/components/admin/employee/employeeDetails";
import AddressInformation from "@/components/admin/employee/addressInfo";
import FormActions from "@/components/admin/employee/formAction";
import { Loader2 } from "lucide-react";

interface Country {
  name: string;
  code: string;
  flag: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  department: Yup.string().required("Department is required"),
  salary: Yup.number()
    .positive("Salary must be greater than 0")
    .required("Salary is required"),
  place: Yup.object({
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
    country: Yup.string().required("Country is required"),
  }),
});

const initialFormData: EmployeeFormData = {
  name: "",
  email: "",
  phone: "",
  department: "",
  salary: 0,
  joinDate: "",
  isActive: true,
  profilePicture: "",
  place: {
    houseName: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "",
  },
};

const AddEditEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id: employeeId } = useParams<{ id: string }>();
  const isEditMode = !!employeeId;
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState(0);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState<string | null>(null);

  const PRODUCT_PROCESS_STATES = [
    "Processing employee",
    "Uploading file",
    "Finalizing process",
    "Failed to upload",
    "Completed uploading",
  ];

  const {
    employee,
    loading: isLoadingEmployee,
    error: employeeError,
  } = useSelector((state: RootState) => state.employee);

  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca2"
        );
        const fetchedCountries = response.data.map((country: any) => ({
          name: country.name.common,
          flag: country.flags?.png || country.flags?.svg,
          code: country.cca2,
        }));
        setCountries(fetchedCountries);
      } catch (error: unknown) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to fetch countries"
          : "An unexpected error occurred while fetching countries";
        setCountriesError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (isEditMode && employeeId) {
      dispatch(getEmployeeById(employeeId));
    }
  }, [dispatch, isEditMode, employeeId]);

  useEffect(() => {
    if (isEditMode && employee) {
      const formattedDate = employee.joinDate
        ? new Date(employee.joinDate).toISOString().split("T")[0]
        : "";
      formik.setValues({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "developer",
        salary: employee.salary || 0,
        joinDate: formattedDate,
        isActive: employee.isActive ?? true,
        profilePicture: employee.profilePicture || "",
        place: {
          houseName: employee.place?.houseName || "",
          street: employee.place?.street || "",
          city: employee.place?.city || "",
          district: employee.place?.district || "",
          state: employee.place?.state || "",
          pincode: employee.place?.pincode || "",
          country: employee.place?.country || "",
        },
      });
      if (employee.profilePicture) {
        setPreviewUrl(employee.profilePicture);
      }
    }
  }, [isEditMode, employee]);

  const handleFileUpload = async () => {
    if (!profileImage) return null;
    const formData = new FormData();
    formData.append("file", profileImage);
    const token = await getToken();
    try {
      setCurrentState(1);
      const response = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data.fileDetails.url;
    } catch (error: unknown) {
      setCurrentState(3);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "File upload failed");
      } else {
        toast.error("An unexpected error occurred during file upload");
      }
      return null;
    }
  };

  const formik = useFormik<EmployeeFormData>({
    initialValues: initialFormData,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setCurrentState(0);
      setIsSubmitting(true);
      try {
        let profilePictureUrl = values.profilePicture;
        if (profileImage) {
          const uploadedUrl = await handleFileUpload();
          if (uploadedUrl) {
            profilePictureUrl = uploadedUrl;
          } else {
            throw new Error("Failed to upload profile picture");
          }
        }
        setCurrentState(2);
        const employeeData = {
          ...values,
          profilePicture: profilePictureUrl,
          ...(isEditMode && { _id: employeeId }),
        };
        if (isEditMode) {
          await dispatch(updateEmployee(employeeData)).unwrap();
        } else {
          await dispatch(createEmployee(employeeData)).unwrap();
        }
        setCurrentState(4);
        successToast(
          `Employee ${isEditMode ? "updated" : "created"} successfully`
        );
        navigate("/admin/employee-table");
      } catch (error: any) {
        setCurrentState(3);
        errorToast(
          error?.message ||
            `Failed to ${isEditMode ? "update" : "create"} employee`
        );
      } finally {
        setTimeout(() => setLoading(false), 1000);
        setIsSubmitting(false);
      }
    },
  });

  if (isEditMode && employeeError) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center"
        >
          <h2 className="text-xl font-semibold text-red-600">
            Error Loading Employee Data
          </h2>
          <p className="text-gray-600 mt-2">{employeeError}</p>
          <button
            onClick={() => navigate("/employee-table")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Employee List
          </button>
        </motion.div>
      </div>
    );
  }

  if (isEditMode && isLoadingEmployee) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="text-blue-600 mb-4"
          >
            <Loader2 size={48} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-semibold text-gray-800"
          >
            Loading Employee Data
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 p-4" style={{ marginTop: 0 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Employee" : "Add New Employee"}
          </h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ProfilePictureUpload
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
              />
              <PersonalInformation formik={formik} />
              <EmploymentDetails formik={formik} />
            </div>
            <AddressInformation
              formik={formik}
              countries={countries}
              countriesLoading={countriesLoading}
              countriesError={countriesError}
              countrySearchTerm={countrySearchTerm}
              setCountrySearchTerm={setCountrySearchTerm}
              isCountryDropdownOpen={isCountryDropdownOpen}
              setIsCountryDropdownOpen={setIsCountryDropdownOpen}
            />
          </div>
          <FormActions
            formik={formik}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </form>
      </motion.div>
      <LoadingModal
        currentStep={currentState}
        isOpen={showLoading}
        steps={PRODUCT_PROCESS_STATES}
        title="Processing Employee"
        onClose={() => setLoading(false)}
      />
    </div>
  );
};

export default AddEditEmployeePage;
