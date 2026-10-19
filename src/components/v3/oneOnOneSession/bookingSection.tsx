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
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

/* ---- Inline comic animations (Web Animations API, no CSS needed) ---- */
type ComicKind = "slam" | "pop";

const COMIC = {
  slam: (r: number) => ({
    duration: 700,
    easing: "ease-out",
    frames: [
      { opacity: 0, transform: "translateY(-40px) scale(2.4) rotate(-6deg)" },
      {
        offset: 0.55,
        opacity: 1,
        transform: `translateY(0px) scale(0.94) rotate(${r + 1}deg)`,
      },
      {
        offset: 0.75,
        opacity: 1,
        transform: `translateY(0px) scale(1.03) rotate(${r - 0.5}deg)`,
      },
      { opacity: 1, transform: `translateY(0px) scale(1) rotate(${r}deg)` },
    ] as Keyframe[],
  }),
  pop: (r: number) => ({
    duration: 650,
    easing: "ease-out",
    frames: [
      { opacity: 0, transform: "translateY(40px) scale(0.6) rotate(-6deg)" },
      {
        offset: 0.6,
        opacity: 1,
        transform: `translateY(-8px) scale(1.04) rotate(${r + 2}deg)`,
      },
      {
        offset: 0.8,
        opacity: 1,
        transform: `translateY(2px) scale(0.99) rotate(${r}deg)`,
      },
      { opacity: 1, transform: `translateY(0px) scale(1) rotate(${r}deg)` },
    ] as Keyframe[],
  }),
};

/* Plays once on load, or when the element scrolls into view (onView).
   `rotate` = the element's existing Tailwind tilt in degrees (e.g. -1). */
const useComic = <T extends HTMLElement>(
  kind: ComicKind,
  delay = 0,
  rotate = 0,
  onView = false,
) => {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spec = COMIC[kind](rotate);
    const play = () => {
      el.style.opacity = "";
      el.animate(spec.frames, {
        duration: spec.duration,
        delay,
        easing: spec.easing,
        fill: "backwards",
      });
    };

    if (!onView || typeof IntersectionObserver === "undefined") {
      play();
      return;
    }

    el.style.opacity = "0";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

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

  // Scroll-triggered comic animations (animation only)
  const titleRef = useComic<HTMLHeadingElement>("slam", 0, 1, true);
  const dateRef = useComic<HTMLDivElement>("pop", 0, 0, true);
  const detailsRef = useComic<HTMLDivElement>("pop", 0, 0, true);
  const hiringRef = useComic<HTMLDivElement>("pop", 150, -1, true);
  const summaryRef = useComic<HTMLDivElement>("pop", 300, 0, true);
  const bookedRef = useComic<HTMLDivElement>("pop", 0, 0, true);

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
      <h2
        ref={titleRef}
        className={`font-comic mb-6 inline-block rotate-1 rounded-2xl border-2 border-gray-900 bg-[#FFD93D] px-5 py-1 text-3xl tracking-wide text-gray-900 shadow-[5px_5px_0_0_#111827] sm:text-4xl`}
      >
        Book Your Session!
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: each child is framed like a comic panel */}
        <div className="space-y-8 lg:col-span-2">
          <div
            ref={dateRef}
            className={`overflow-hidden bg-white p-1 rounded-2xl border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] [&_input]:border-2 [&_input]:border-gray-900 [&_select]:border-2 [&_select]:border-gray-900 [&_textarea]:border-2 [&_textarea]:border-gray-900`}
          >
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
          </div>

          <div
            ref={detailsRef}
            className={`overflow-hidden bg-[#E0F7FD] p-1 rounded-2xl border-2 border-gray-900 shadow-[6px_6px_0_0_#111827] [&_input]:border-2 [&_input]:border-gray-900 [&_select]:border-2 [&_select]:border-gray-900 [&_textarea]:border-2 [&_textarea]:border-gray-900`}
          >
            <DetailsSection
              formik={formik}
              child={child}
              childErrors={childErrors}
              onChildChange={handleChildChange}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8 lg:col-span-1">
          {psychologistHiring.length > 0 && (
            <div
              ref={hiringRef}
              className={`-rotate-1 overflow-hidden bg-[#7AE582] p-1 rounded-2xl border-2 border-gray-900 shadow-[6px_6px_0_0_#111827]`}
            >
              <WeAreHiring hiring={psychologistHiring} />
            </div>
          )}

          <div
            ref={summaryRef}
            className={`overflow-hidden bg-[#FFD93D] p-1 rounded-2xl border-2 border-gray-900 shadow-[6px_6px_0_0_#111827]`}
          >
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
      </div>

      <div
        ref={bookedRef}
        className={`mt-10 overflow-hidden bg-white rounded-2xl border-2 border-gray-900 shadow-[6px_6px_0_0_#111827]`}
      >
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
