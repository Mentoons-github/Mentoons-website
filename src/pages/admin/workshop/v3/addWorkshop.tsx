import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

/* ----------------------------- Types ----------------------------- */

interface AgeCategory {
  ageRange: string;
  image: File | null;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // 2 to 4
  correctIndex: number;
  points: number;
}

interface ModuleQuiz {
  title: string;
  totalMarks: number;
  questions: QuizQuestion[];
}

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  video: File | null;
  images: File[];
  quiz: ModuleQuiz;
}

interface WorkshopFormValues {
  title: string;
  description: string;
  duration: string;
  image: File | null;
  ageCategories: AgeCategory[];
  modules: ModuleItem[];
}

/* ----------------------------- Constants ----------------------------- */

const DURATIONS = [
  { value: "1-week", label: "1 Week" },
  { value: "1-month", label: "1 Month" },
  { value: "3-months", label: "3 Months" },
  { value: "6-months", label: "6 Months" },
];

const AGE_RANGES = ["6-12", "13-19", "20+"];
const MAX_OPTIONS = 4;

let idCounter = 0;
const uid = () => `${Date.now()}-${idCounter++}`;

const emptyQuestion = (): QuizQuestion => ({
  id: uid(),
  question: "",
  options: ["", ""],
  correctIndex: 0,
  points: 1,
});

const emptyModule = (): ModuleItem => ({
  id: uid(),
  title: "",
  description: "",
  video: null,
  images: [],
  quiz: { title: "", totalMarks: 0, questions: [emptyQuestion()] },
});

const initialValues: WorkshopFormValues = {
  title: "",
  description: "",
  duration: "",
  image: null,
  ageCategories: [],
  modules: [emptyModule()],
};

/* ----------------------------- Validation ----------------------------- */

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Workshop title is required"),
  description: Yup.string().trim().required("Description is required"),
  duration: Yup.string().required("Select a duration"),
  image: Yup.mixed().required("Workshop image is required"),
  ageCategories: Yup.array()
    .of(
      Yup.object({
        ageRange: Yup.string().required(),
        image: Yup.mixed().required("Age category image is required"),
      }),
    )
    .min(1, "Select at least one age category"),
  modules: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().trim().required("Module title is required"),
        description: Yup.string()
          .trim()
          .required("Module description is required"),
        video: Yup.mixed().required("Module video is required"),
        quiz: Yup.object({
          title: Yup.string().trim().required("Quiz title is required"),
          totalMarks: Yup.number()
            .typeError("Enter a number")
            .min(1, "Total marks must be at least 1")
            .required("Total marks are required")
            .test(
              "sum-matches",
              "Total marks must equal the sum of all question points",
              function (value) {
                const qs: QuizQuestion[] = this.parent.questions || [];
                const sum = qs.reduce((a, q) => a + (Number(q.points) || 0), 0);
                return Number(value) === sum;
              },
            ),
          questions: Yup.array()
            .of(
              Yup.object({
                question: Yup.string().trim().required("Question is required"),
                options: Yup.array()
                  .of(Yup.string().trim().required("Option cannot be empty"))
                  .min(2, "At least 2 options")
                  .max(MAX_OPTIONS, "Maximum 4 options"),
                correctIndex: Yup.number().required(),
                points: Yup.number()
                  .typeError("Enter a number")
                  .min(1, "Minimum 1 point")
                  .required("Points are required"),
              }),
            )
            .min(1, "Add at least one question"),
        }),
      }),
    )
    .min(1, "Add at least one module"),
});

/* ----------------------------- Styles ----------------------------- */

const inputCls =
  "w-full px-3 sm:px-4 py-2 sm:py-3 text-base rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls = "block text-base sm:text-lg font-semibold text-gray-900";
const subLabelCls = "block text-sm font-medium text-gray-700";
const errCls = "text-red-500 text-sm font-medium";
const addBtnCls =
  "w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed";
const removeBtnCls =
  "px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed";
const fileInputCls =
  "block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-600 file:text-white file:font-medium hover:file:bg-green-700 file:cursor-pointer";

/* ----------------------------- Collapsible section ----------------------------- */

/**
 * Click the header to minimize / expand. Content stays mounted (just hidden),
 * so nothing is lost when collapsed. Opens itself if it contains an error.
 */
const Accordion: React.FC<{
  title: ReactNode;
  summary?: ReactNode;
  defaultOpen?: boolean;
  hasError?: boolean;
  actions?: ReactNode;
  level?: 1 | 2 | 3;
  children: ReactNode;
}> = ({
  title,
  summary,
  defaultOpen = true,
  hasError,
  actions,
  level = 1,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (hasError) setOpen(true);
  }, [hasError]);

  const shell =
    level === 1
      ? "border-2 border-gray-200 rounded-2xl bg-white"
      : level === 2
        ? "border border-gray-200 rounded-xl bg-gray-50"
        : "border border-gray-200 rounded-xl bg-white";

  return (
    <div className={`${shell} ${hasError ? "!border-red-300" : ""}`}>
      <div className="flex items-center gap-2 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex-1 flex items-center gap-3 text-left min-w-0"
        >
          <ChevronDownIcon
            className={`w-5 h-5 shrink-0 text-green-600 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
          <span className="min-w-0">
            <span
              className={`block font-semibold text-gray-900 truncate ${
                level === 1 ? "text-lg sm:text-xl" : "text-base"
              }`}
            >
              {title}
            </span>
            {!open && summary && (
              <span className="block text-sm text-gray-500 truncate">
                {summary}
              </span>
            )}
          </span>
          {hasError && (
            <span className="shrink-0 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
              Needs attention
            </span>
          )}
        </button>
        {actions}
      </div>
      <div className={open ? "px-3 sm:px-5 pb-4 sm:pb-5 space-y-5" : "hidden"}>
        {children}
      </div>
    </div>
  );
};

/* ----------------------------- Upload helpers ----------------------------- */

const useObjectUrl = (file: File | null) => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  return url;
};

const ImagePreview: React.FC<{
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}> = ({ file, onRemove, disabled }) => {
  const url = useObjectUrl(file);
  return (
    <div className="relative w-full sm:w-40 md:w-48 h-40 md:h-48">
      {url && (
        <img
          src={url}
          alt={file.name}
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remove image"
        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg disabled:opacity-50"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

const SingleImageUpload: React.FC<{
  id: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}> = ({ id, file, onChange, disabled }) => (
  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
    <div
      className={`relative flex items-center justify-center w-full sm:w-40 md:w-48 h-40 md:h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 bg-gray-50 hover:bg-green-50 group transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        id={id}
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          if (f) onChange(f);
          e.target.value = "";
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="text-center px-2">
        <PlusIcon className="w-10 h-10 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
        <p className="text-gray-600 font-medium group-hover:text-green-600 text-sm">
          Click to upload image
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
    {file && (
      <ImagePreview
        file={file}
        onRemove={() => onChange(null)}
        disabled={disabled}
      />
    )}
  </div>
);

const VideoUpload: React.FC<{
  id: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}> = ({ id, file, onChange, disabled }) => {
  const url = useObjectUrl(file);
  return (
    <div className="space-y-3">
      <input
        id={id}
        type="file"
        accept="video/*"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          if (f) onChange(f);
          e.target.value = "";
        }}
        className={fileInputCls}
      />
      {file && url && (
        <div className="space-y-2">
          <video
            src={url}
            controls
            className="w-full max-w-md rounded-xl shadow"
          />
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="truncate max-w-xs">{file.name}</span>
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Remove video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MultiImageUpload: React.FC<{
  id: string;
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}> = ({ id, files, onChange, disabled }) => (
  <div className="space-y-3">
    <input
      id={id}
      type="file"
      accept="image/*"
      multiple
      disabled={disabled}
      onChange={(e) => {
        const picked = Array.from(e.target.files ?? []);
        if (picked.length) onChange([...files, ...picked]);
        e.target.value = "";
      }}
      className={fileInputCls}
    />
    {files.length > 0 && (
      <div className="flex flex-wrap gap-4">
        {files.map((f, i) => (
          <ImagePreview
            key={`${f.name}-${i}`}
            file={f}
            disabled={disabled}
            onRemove={() => onChange(files.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
    )}
  </div>
);

/* ----------------------------- Module quiz ----------------------------- */

const ModuleQuizSection: React.FC<{
  mi: number;
  mod: ModuleItem;
  setFieldValue: (field: string, value: unknown) => void;
  disabled: boolean;
  hasError: boolean;
}> = ({ mi, mod, setFieldValue, disabled, hasError }) => {
  const base = `modules[${mi}].quiz`;
  const pointsSum = mod.quiz.questions.reduce(
    (a, q) => a + (Number(q.points) || 0),
    0,
  );

  return (
    <Accordion
      level={2}
      title="Module Quiz"
      summary={`${mod.quiz.questions.length} question(s) · ${pointsSum} points`}
      hasError={hasError}
      defaultOpen={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor={`${base}.title`} className={subLabelCls}>
            Quiz Title
          </label>
          <Field
            id={`${base}.title`}
            name={`${base}.title`}
            type="text"
            placeholder="e.g. Module assessment"
            disabled={disabled}
            className={inputCls}
          />
          <ErrorMessage
            name={`${base}.title`}
            component="div"
            className={errCls}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${base}.totalMarks`} className={subLabelCls}>
            Total Marks (questions add up to {pointsSum})
          </label>
          <Field
            id={`${base}.totalMarks`}
            name={`${base}.totalMarks`}
            type="number"
            min={1}
            disabled={disabled}
            className={inputCls}
          />
          <ErrorMessage
            name={`${base}.totalMarks`}
            component="div"
            className={errCls}
          />
        </div>
      </div>

      <FieldArray name={`${base}.questions`}>
        {({ push, remove }) => (
          <div className="space-y-3">
            {mod.quiz.questions.map((q, qi) => (
              <Accordion
                key={q.id}
                level={3}
                title={`Question ${qi + 1}`}
                summary={q.question || "No question text yet"}
                defaultOpen={qi === 0}
                actions={
                  <button
                    type="button"
                    onClick={() => remove(qi)}
                    disabled={disabled || mod.quiz.questions.length === 1}
                    className={removeBtnCls}
                  >
                    <FaTrash className="w-3 h-3" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                }
              >
                <div className="space-y-2">
                  <label
                    htmlFor={`${base}.questions[${qi}].question`}
                    className={subLabelCls}
                  >
                    Question
                  </label>
                  <Field
                    id={`${base}.questions[${qi}].question`}
                    name={`${base}.questions[${qi}].question`}
                    as="textarea"
                    rows={2}
                    placeholder="Type the question"
                    disabled={disabled}
                    className={inputCls}
                  />
                  <ErrorMessage
                    name={`${base}.questions[${qi}].question`}
                    component="div"
                    className={errCls}
                  />
                </div>

                <div className="space-y-3">
                  <span className={subLabelCls}>
                    Options (select the correct answer)
                  </span>
                  {q.options.map((_, oi) => (
                    <div key={oi} className="space-y-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${mod.id}-${q.id}`}
                          aria-label={`Mark option ${oi + 1} as correct`}
                          checked={q.correctIndex === oi}
                          disabled={disabled}
                          onChange={() =>
                            setFieldValue(
                              `${base}.questions[${qi}].correctIndex`,
                              oi,
                            )
                          }
                          className="w-5 h-5 text-green-600 focus:ring-green-500"
                        />
                        <Field
                          name={`${base}.questions[${qi}].options[${oi}]`}
                          type="text"
                          placeholder={`Option ${oi + 1}`}
                          disabled={disabled}
                          className={inputCls}
                        />
                        <button
                          type="button"
                          aria-label={`Remove option ${oi + 1}`}
                          disabled={disabled || q.options.length <= 2}
                          onClick={() => {
                            setFieldValue(
                              `${base}.questions[${qi}].options`,
                              q.options.filter((_, i) => i !== oi),
                            );
                            if (q.correctIndex === oi) {
                              setFieldValue(
                                `${base}.questions[${qi}].correctIndex`,
                                0,
                              );
                            } else if (q.correctIndex > oi) {
                              setFieldValue(
                                `${base}.questions[${qi}].correctIndex`,
                                q.correctIndex - 1,
                              );
                            }
                          }}
                          className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <ErrorMessage
                        name={`${base}.questions[${qi}].options[${oi}]`}
                        component="div"
                        className={`${errCls} ml-8`}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={disabled || q.options.length >= MAX_OPTIONS}
                    onClick={() =>
                      setFieldValue(`${base}.questions[${qi}].options`, [
                        ...q.options,
                        "",
                      ])
                    }
                    className={addBtnCls}
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Option ({q.options.length}/{MAX_OPTIONS})
                  </button>
                </div>

                <div className="space-y-2 max-w-xs">
                  <label
                    htmlFor={`${base}.questions[${qi}].points`}
                    className={subLabelCls}
                  >
                    Points for this question
                  </label>
                  <Field
                    id={`${base}.questions[${qi}].points`}
                    name={`${base}.questions[${qi}].points`}
                    type="number"
                    min={1}
                    disabled={disabled}
                    className={inputCls}
                  />
                  <ErrorMessage
                    name={`${base}.questions[${qi}].points`}
                    component="div"
                    className={errCls}
                  />
                </div>
              </Accordion>
            ))}
            <button
              type="button"
              onClick={() => push(emptyQuestion())}
              disabled={disabled}
              className={addBtnCls}
            >
              <PlusIcon className="w-5 h-5" />
              Add Question
            </button>
          </div>
        )}
      </FieldArray>
    </Accordion>
  );
};

/* ----------------------------- Page ----------------------------- */

const AddWorkshopV3: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    values: WorkshopFormValues,
    { resetForm }: FormikHelpers<WorkshopFormValues>,
  ) => {
    setIsSubmitting(true);
    // Static page: replace this with your file uploads + POST request.
    await new Promise((r) => setTimeout(r, 800));
    console.log("Workshop payload:", values);
    toast.success("Workshop created successfully!");
    resetForm({ values: { ...initialValues, modules: [emptyModule()] } });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Add New Workshop
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Workshop Details
          </h2>
          <p className="text-green-100 mt-1 text-sm sm:text-base">
            Click any section title to minimize or expand it
          </p>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched, submitCount }) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const errs = errors as any;
              const submitted = submitCount > 0;
              const workshopTotal = values.modules.reduce(
                (a, m) => a + (Number(m.quiz.totalMarks) || 0),
                0,
              );
              const hasAge = values.ageCategories.length > 0;
              const durationLabel = DURATIONS.find(
                (d) => d.value === values.duration,
              )?.label;

              return (
                <Form className="space-y-5">
                  {/* ---------------- 1. Basic info ---------------- */}
                  <Accordion
                    title="Workshop Info"
                    summary={
                      [values.title, durationLabel]
                        .filter(Boolean)
                        .join(" · ") || "Title, duration, image"
                    }
                    hasError={
                      submitted &&
                      !!(
                        errs.title ||
                        errs.description ||
                        errs.duration ||
                        errs.image
                      )
                    }
                  >
                    <div className="space-y-3">
                      <label htmlFor="title" className={labelCls}>
                        Workshop Title
                      </label>
                      <Field
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Enter workshop title"
                        disabled={isSubmitting}
                        className={inputCls}
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className={errCls}
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="description" className={labelCls}>
                        Description
                      </label>
                      <Field
                        id="description"
                        name="description"
                        as="textarea"
                        rows={4}
                        placeholder="Describe the workshop"
                        disabled={isSubmitting}
                        className={inputCls}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className={errCls}
                      />
                    </div>

                    <div className="space-y-3">
                      <span className={labelCls}>Workshop Duration</span>
                      <div
                        role="radiogroup"
                        aria-label="Workshop duration"
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                      >
                        {DURATIONS.map((d) => {
                          const selected = values.duration === d.value;
                          return (
                            <button
                              key={d.value}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              disabled={isSubmitting}
                              onClick={() => setFieldValue("duration", d.value)}
                              className={`py-3 rounded-xl border-2 font-semibold transition-all duration-200 disabled:opacity-50 ${
                                selected
                                  ? "border-green-500 bg-green-600 text-white shadow-lg"
                                  : "border-gray-200 bg-gray-50 text-gray-800 hover:border-green-300 hover:bg-green-50"
                              }`}
                            >
                              {d.label}
                            </button>
                          );
                        })}
                      </div>
                      {(touched.duration || submitted) && errs.duration && (
                        <div className={errCls}>{errs.duration}</div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="workshopImage" className={labelCls}>
                        Workshop Image
                      </label>
                      <SingleImageUpload
                        id="workshopImage"
                        file={values.image}
                        onChange={(f) => setFieldValue("image", f)}
                        disabled={isSubmitting}
                      />
                      {(touched.image || submitted) && errs.image && (
                        <div className={errCls}>{errs.image}</div>
                      )}
                    </div>
                  </Accordion>

                  {/* ---------------- 2. Age categories ---------------- */}
                  <Accordion
                    title="Age Category"
                    summary={
                      hasAge
                        ? values.ageCategories.map((a) => a.ageRange).join(", ")
                        : "None selected"
                    }
                    hasError={submitted && !!errs.ageCategories}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      {AGE_RANGES.map((age) => {
                        const checked = values.ageCategories.some(
                          (a) => a.ageRange === age,
                        );
                        return (
                          <label
                            key={age}
                            className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                              checked
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-gray-50 hover:border-green-300"
                            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isSubmitting}
                              onChange={(e) =>
                                setFieldValue(
                                  "ageCategories",
                                  e.target.checked
                                    ? [
                                        ...values.ageCategories,
                                        { ageRange: age, image: null },
                                      ]
                                    : values.ageCategories.filter(
                                        (a) => a.ageRange !== age,
                                      ),
                                )
                              }
                              className="w-5 h-5 rounded text-green-600 border-2 border-gray-300 focus:ring-green-500"
                            />
                            <span className="text-gray-900 font-medium">
                              {age} years old
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {typeof errs.ageCategories === "string" &&
                      (touched.ageCategories || submitted) && (
                        <div className={errCls}>{errs.ageCategories}</div>
                      )}

                    {values.ageCategories.map((cat, i) => (
                      <div
                        key={cat.ageRange}
                        className="border rounded-xl p-4 bg-gray-50 space-y-3"
                      >
                        <label htmlFor={`age-image-${i}`} className={labelCls}>
                          Image for age {cat.ageRange}
                        </label>
                        <SingleImageUpload
                          id={`age-image-${i}`}
                          file={cat.image}
                          onChange={(f) =>
                            setFieldValue(`ageCategories[${i}].image`, f)
                          }
                          disabled={isSubmitting}
                        />
                        <ErrorMessage
                          name={`ageCategories[${i}].image`}
                          component="div"
                          className={errCls}
                        />
                      </div>
                    ))}
                  </Accordion>

                  {/* ---------------- 3. Modules (only after an age is picked) ---------------- */}
                  {hasAge ? (
                    <Accordion
                      title="Modules"
                      summary={`${values.modules.length} module(s) · ${workshopTotal} total points`}
                      hasError={submitted && typeof errs.modules === "string"}
                    >
                      <FieldArray name="modules">
                        {({ push, remove }) => (
                          <div className="space-y-4">
                            {values.modules.map((mod, mi) => {
                              const modErr = Array.isArray(errs.modules)
                                ? errs.modules[mi]
                                : undefined;
                              return (
                                <Accordion
                                  key={mod.id}
                                  level={2}
                                  title={`Module ${mi + 1}${mod.title ? `: ${mod.title}` : ""}`}
                                  summary={
                                    mod.description || "No description yet"
                                  }
                                  defaultOpen={mi === 0}
                                  hasError={submitted && !!modErr}
                                  actions={
                                    <button
                                      type="button"
                                      onClick={() => remove(mi)}
                                      disabled={
                                        isSubmitting ||
                                        values.modules.length === 1
                                      }
                                      className={removeBtnCls}
                                    >
                                      <FaTrash className="w-3 h-3" />
                                      <span className="hidden sm:inline">
                                        Remove
                                      </span>
                                    </button>
                                  }
                                >
                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`modules[${mi}].title`}
                                      className={subLabelCls}
                                    >
                                      Module Title
                                    </label>
                                    <Field
                                      id={`modules[${mi}].title`}
                                      name={`modules[${mi}].title`}
                                      type="text"
                                      placeholder="Enter module title"
                                      disabled={isSubmitting}
                                      className={inputCls}
                                    />
                                    <ErrorMessage
                                      name={`modules[${mi}].title`}
                                      component="div"
                                      className={errCls}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`modules[${mi}].description`}
                                      className={subLabelCls}
                                    >
                                      Module Description
                                    </label>
                                    <Field
                                      id={`modules[${mi}].description`}
                                      name={`modules[${mi}].description`}
                                      as="textarea"
                                      rows={3}
                                      placeholder="Enter module description"
                                      disabled={isSubmitting}
                                      className={inputCls}
                                    />
                                    <ErrorMessage
                                      name={`modules[${mi}].description`}
                                      component="div"
                                      className={errCls}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`modules-video-${mi}`}
                                      className={subLabelCls}
                                    >
                                      Module Video
                                    </label>
                                    <VideoUpload
                                      id={`modules-video-${mi}`}
                                      file={mod.video}
                                      onChange={(f) =>
                                        setFieldValue(`modules[${mi}].video`, f)
                                      }
                                      disabled={isSubmitting}
                                    />
                                    <ErrorMessage
                                      name={`modules[${mi}].video`}
                                      component="div"
                                      className={errCls}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`modules-images-${mi}`}
                                      className={subLabelCls}
                                    >
                                      Module Images (optional, you can pick
                                      several)
                                    </label>
                                    <MultiImageUpload
                                      id={`modules-images-${mi}`}
                                      files={mod.images}
                                      onChange={(files) =>
                                        setFieldValue(
                                          `modules[${mi}].images`,
                                          files,
                                        )
                                      }
                                      disabled={isSubmitting}
                                    />
                                  </div>

                                  <ModuleQuizSection
                                    mi={mi}
                                    mod={mod}
                                    setFieldValue={setFieldValue}
                                    disabled={isSubmitting}
                                    hasError={submitted && !!modErr?.quiz}
                                  />
                                </Accordion>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => push(emptyModule())}
                              disabled={isSubmitting}
                              className={addBtnCls}
                            >
                              <PlusIcon className="w-5 h-5" />
                              Add Module
                            </button>
                          </div>
                        )}
                      </FieldArray>
                      {typeof errs.modules === "string" && (
                        <div className={errCls}>{errs.modules}</div>
                      )}
                    </Accordion>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 text-center text-gray-500">
                      Select an age category above to add modules and quizzes.
                    </div>
                  )}

                  {/* ---------------- Submit ---------------- */}
                  <div className="pt-4 sm:pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 sm:py-4 text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl transition-all duration-300 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : "Create Workshop"}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddWorkshopV3;
