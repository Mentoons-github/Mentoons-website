import PostPone from "@/components/common/modal/postPone";
import SelectedDateBookings from "@/components/session/selectedBookings";
import {
  fetchSessions,
  fetchAvailableSlots,
  clearSlots,
  SessionDetails,
  Psychologist,
} from "@/redux/sessionSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useSessionForm } from "@/utils/formik/sessionForm";
import BookedSession from "@/pages/v2/user/sessionBooking/bookedSession";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DateTimeSection from "./DateTimeSelection";
import DetailsSection from "./detailsSection";
import {
  SESSION_OPTIONS,
  SessionDuration,
  toDateKey,
} from "@/config/sessionConfig";
import SessionSummary from "./sessionSummary";
import ErrorModal from "@/components/adda/modal/error";
import WeAreHiring from "@/components/assessment/weAreHiring";
import { HIRING } from "@/constant/constants";

interface BookingValues {
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  state: string;
  description?: string;
}

interface BookingSectionProps {
  selectedPsychologist: Psychologist | null;
}

const BookingSection = ({ selectedPsychologist }: BookingSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, sessions, slots, slotsLoading } = useSelector(
    (root: RootState) => root.session,
  );
  const { getToken } = useAuth();
  const { user } = useUser();
  const topRef = useRef<HTMLElement>(null);

  const [duration, setDuration] = useState<SessionDuration>("1hr");
  const [child, setChild] = useState({ name: "", age: "" });
  const [childErrors, setChildErrors] = useState<{
    name?: string;
    age?: string;
  }>({});
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [postponeOpen, setPostponeOpen] = useState(false);
  const [bookingToPostpone, setBookingToPostpone] =
    useState<SessionDetails | null>(null);

  const formik = useSessionForm(() => undefined);

  const bookedCalls = useMemo(() => sessions ?? [], [sessions]);
  const activeOption = SESSION_OPTIONS.find((o) => o.value === duration)!;

  // Only the "Psychologist" hiring listing is shown alongside the booking form
  const psychologistHiring = useMemo(
    () => HIRING.filter((job) => job.job.toLowerCase().includes("psycholog")),
    [],
  );

  const selectedDate = formik.values.selectedDate;
  const selectedSlot = formik.values.selectedTime;

  const selectedDateBookings = useMemo(
    () =>
      bookedCalls.filter(
        (booking) => booking.date.split("T")[0] === selectedDate,
      ),
    [bookedCalls, selectedDate],
  );

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchSessions(token));
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!formik.values.selectedDate) {
      formik.setFieldValue("selectedDate", toDateKey(new Date()), false);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const loadUser = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/user/user/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const data = response.data?.data;
        if (response.status === 200 && data) {
          formik.setFieldValue("name", data.name || "", false);
          formik.setFieldValue("email", data.email || "", false);
          formik.setFieldValue("phone", data.phoneNumber || "", false);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Failed to fetch user data");
      }
    };

    loadUser();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedDate) return;

    const load = async () => {
      const token = await getToken();
      if (!token) return;

      const data = await dispatch(
        fetchAvailableSlots({
          token,
          date: selectedDate,
          duration: activeOption.label,
          psychologistId: selectedPsychologist?._id,
          state: formik.values.state || undefined,
        }),
      ).unwrap();

      console.log("Available Slots Data:", data);
    };

    load();
  }, [selectedDate, activeOption.label, selectedPsychologist?._id]);

  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  const handleSelectDate = (date: string) => {
    if (date === formik.values.selectedDate) return;
    formik.setFieldValue("selectedDate", date, false);
    formik.setFieldValue("selectedTime", "", false);
    dispatch(clearSlots());
  };

  const handleSelectSlot = (slot: string) => {
    formik.setFieldValue("selectedTime", slot, false);
  };

  const handleChildChange = (field: "name" | "age", value: string) => {
    setChild((prev) => ({ ...prev, [field]: value }));
    setChildErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePostponeBooking = (data: SessionDetails) => {
    setBookingToPostpone(data);
    setPostponeOpen(true);
  };

  const scrollToBookingForm = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBook = async (values: BookingValues) => {
    setSubmitting(true);

    try {
      const { name, email, phone, selectedDate, selectedTime, state } = values;

      const token = await getToken();
      if (!token) {
        showErrorModal("Please login to continue");
        return;
      }

      const detailParts: string[] = [];
      if (child.name.trim()) detailParts.push(`Child: ${child.name.trim()}`);
      if (child.age) detailParts.push(`Age: ${child.age}`);
      if (values.description?.trim()) {
        detailParts.push(values.description.trim());
      }
      const description =
        detailParts.join(" | ") || "No additional details provided";

      const { price, label: durationLabel } = activeOption;

      const paymentData = {
        orderId: `#ASM-${Date.now()}`,
        totalAmount: price,
        amount: price,
        currency: "INR",
        productInfo: "Mentoons One-On-One Session",
        customerName: name,
        email,
        phone,
        status: "PENDING",
        user: user?.id,
        order_type: "consultancy_purchase",
        items: [
          {
            productName: "One-On-One Session",
            price,
            quantity: 1,
            date: selectedDate,
            time: selectedTime,
            duration: durationLabel,
            description,
            state,
            psychologistId: selectedPsychologist?._id,
          },
        ],
        orderStatus: "pending",
        paymentDetails: {
          paymentMethod: "credit_card",
          paymentStatus: "initiated",
        },
        bookingDetails: {
          name,
          email,
          phone,
          date: selectedDate,
          time: selectedTime,
          duration: durationLabel,
          description,
          state,
          psychologistId: selectedPsychologist?._id,
        },
        sameAsShipping: true,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/payment/initiate`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data) {
        showErrorModal("Failed to initiate payment");
        return;
      }

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.data;

      const form = tempDiv.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error("Payment form not found in response");
      }
    } catch (err) {
      console.error("Payment error:", err);

      if (axios.isAxiosError(err) && err.response) {
        const message =
          err.response.data?.message || "Failed to process payment";

        if (
          err.response.status === 400 &&
          err.response.data?.message?.includes("psychologists are fully booked")
        ) {
          showErrorModal(
            "All psychologists are fully booked at the selected date and time. Please choose another slot.",
          );
        } else {
          showErrorModal(message);
        }
      } else {
        showErrorModal(
          err instanceof Error
            ? err.message
            : "Failed to process payment. Please try again later.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onBook = async () => {
    setAttempted(true);

    const errs: { name?: string; age?: string } = {};
    if (!child.name.trim()) errs.name = "Child's name is required";
    if (!child.age) errs.age = "Select child's age";
    setChildErrors(errs);

    const formErrors = await formik.validateForm();
    formik.setTouched(
      {
        name: true,
        email: true,
        phone: true,
        selectedDate: true,
        selectedTime: true,
        state: true,
        description: true,
      },
      false,
    );

    if (!selectedPsychologist) {
      showErrorModal("Please select a psychologist before booking.");
      return;
    }

    if (
      Object.keys(errs).length > 0 ||
      Object.keys(formErrors).length > 0 ||
      !formik.values.selectedDate ||
      !formik.values.selectedTime
    ) {
      return;
    }

    await handleBook(formik.values);
  };

  return (
    <section ref={topRef} className="w-full">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DateTimeSection
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
            duration={duration}
            onSelectDuration={setDuration}
            bookedCalls={bookedCalls}
            dateError={
              attempted && !selectedDate ? "Please select a date" : undefined
            }
            slotError={
              attempted && !selectedSlot ? "Please pick a slot" : undefined
            }
            slots={slots}
            slotsLoading={slotsLoading}
          />
          <DetailsSection
            formik={formik}
            child={child}
            childErrors={childErrors}
            onChildChange={handleChildChange}
          />
        </div>

        <div className="space-y-6 lg:col-span-1">
          {psychologistHiring.length > 0 && (
            <WeAreHiring hiring={psychologistHiring} />
          )}

          <SessionSummary
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            option={activeOption}
            submitting={submitting}
            onBook={onBook}
            psychologist={selectedPsychologist}
          >
            {selectedDateBookings.length > 0 && (
              <SelectedDateBookings
                date={selectedDate}
                bookings={selectedDateBookings}
                scrollToBookingForm={scrollToBookingForm}
              />
            )}
          </SessionSummary>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <BookedSession
          error={error}
          loading={loading}
          bookedCalls={bookedCalls}
          postponeBooking={handlePostponeBooking}
          selectedDateBookings={selectedDateBookings}
        />
      </div>

      <PostPone
        isModalOpen={postponeOpen}
        setIsPostponeModal={setPostponeOpen}
        postponeBooking={bookingToPostpone}
      />

      <ErrorModal
        open={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </section>
  );
};

export default BookingSection;
