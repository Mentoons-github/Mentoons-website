import {
  Trash2,
  Plus,
  Star,
  Sparkles,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Smile,
} from "lucide-react";
import { useFormik } from "formik";
import { api } from "@/api/axiosInstance/axiosInstance";
import {
  Quiz,
  quizInitialValues,
  quizValidationSchema,
} from "@/utils/formik/quiz";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import { useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = [
  "Gambling addiction",
  "Mobile addiction",
  "Gaming addiction",
  "Performance addiction",
  "Entertainment addiction",
  "sample",
] as const;

const CATEGORY_EMOJIS: Record<string, string> = {
  "Gambling addiction": "🎲",
  "Mobile addiction": "📱",
  "Gaming addiction": "🎮",
  "Performance addiction": "🏆",
  "Entertainment addiction": "🎬",
  sample: "✨",
};

const OPTION_COLORS = [
  {
    wrap: "bg-pink-100 border-pink-300 hover:bg-pink-200",
    badge: "bg-pink-400",
  },
  {
    wrap: "bg-yellow-100 border-yellow-300 hover:bg-yellow-200",
    badge: "bg-yellow-400",
  },
  {
    wrap: "bg-green-100 border-green-300 hover:bg-green-200",
    badge: "bg-green-400",
  },
  {
    wrap: "bg-blue-100 border-blue-300 hover:bg-blue-200",
    badge: "bg-blue-400",
  },
  {
    wrap: "bg-purple-100 border-purple-300 hover:bg-purple-200",
    badge: "bg-purple-400",
  },
];

const Q_HEADERS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-red-500",
];

const RANGE_THEMES = [
  {
    card: "bg-gradient-to-br from-green-100 to-emerald-100 border-green-300",
    bar: "bg-green-400",
    emoji: "😊",
  },
  {
    card: "bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-300",
    bar: "bg-yellow-400",
    emoji: "😐",
  },
  {
    card: "bg-gradient-to-br from-orange-100 to-red-100 border-orange-300",
    bar: "bg-orange-400",
    emoji: "😟",
  },
  {
    card: "bg-gradient-to-br from-red-100 to-pink-100 border-red-300",
    bar: "bg-red-400",
    emoji: "😰",
  },
  {
    card: "bg-gradient-to-br from-purple-100 to-violet-100 border-purple-300",
    bar: "bg-purple-400",
    emoji: "🌟",
  },
];

const AddQuiz = () => {
  const { showModal } = useSubmissionModal();
  const navigate = useNavigate();

  const formik = useFormik<Quiz>({
    initialValues: quizInitialValues,
    validationSchema: quizValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        showModal({
          isSubmitting: true,
          currentStep: "uploading",
          message: "Preparing quiz data...",
        });
        const questionsAndOptions = values.questions.map((q) => ({
          question: q.question,
          options: q.options.map((o) => ({
            text: o.text,
            score: Number(o.score),
          })),
        }));
        const payload = {
          category: values.category,
          questionsAndOptions,
          results: values.results,
        };
        showModal({
          isSubmitting: true,
          currentStep: "saving",
          message: "Saving quiz to server...",
        });
        const response = await api.post("/quiz/add", payload);
        showModal({
          isSubmitting: false,
          currentStep: "success",
          message: response.data.message || "Quiz saved successfully!",
        });
        setTimeout(() => navigate("/admin/quiz"), 2000);
      } catch (err: any) {
        showModal({
          isSubmitting: false,
          currentStep: "error",
          message: err?.response?.data?.message || "Failed to save quiz",
          error: err?.message || "Unknown error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const addQuestion = () => {
    formik.setFieldValue("questions", [
      ...formik.values.questions,
      {
        question: "",
        options: [
          { text: "", score: 0 },
          { text: "", score: 0 },
          { text: "", score: 0 },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    formik.setFieldValue(
      "questions",
      formik.values.questions.filter((_, i) => i !== index),
    );
  };

  const updateQuestion = (qIdx: number, val: string) =>
    formik.setFieldValue(`questions[${qIdx}].question`, val);

  const updateOption = (
    qIdx: number,
    oIdx: number,
    field: "text" | "score",
    val: string | number,
  ) =>
    formik.setFieldValue(
      `questions[${qIdx}].options[${oIdx}].${field}`,
      field === "score" ? Number(val) || 0 : val,
    );

  const getQuestionError = (qIdx: number) => {
    const err = formik.errors.questions?.[qIdx];
    return typeof err === "object" && "question" in err
      ? err.question
      : undefined;
  };

  const getOptionError = (
    qIdx: number,
    oIdx: number,
    field: "text" | "score",
  ) => {
    const err = formik.errors.questions?.[qIdx];
    if (typeof err === "object" && "options" in err) {
      const optErr = (err.options as any)?.[oIdx];
      return typeof optErr === "object" && field in optErr
        ? optErr[field]
        : undefined;
    }
    return undefined;
  };

  const addResultRange = () => {
    const last = formik.values.results?.[formik.values.results!.length - 1];
    const start = last ? last.maxScore + 1 : 0;
    const end = totalPossibleScore > start ? totalPossibleScore : start;
    formik.setFieldValue("results", [
      ...(formik.values.results || []),
      { minScore: start, maxScore: end, message: "" },
    ]);
  };

  const removeResultRange = (idx: number) =>
    formik.setFieldValue(
      "results",
      (formik.values.results || []).filter((_, i) => i !== idx),
    );

  const updateResult = (
    idx: number,
    field: "minScore" | "maxScore" | "message",
    val: string | number,
  ) =>
    formik.setFieldValue(
      `results[${idx}].${field}`,
      field === "message" ? val : Number(val),
    );

  const getResultError = (
    idx: number,
    field: "minScore" | "maxScore" | "message",
  ) => {
    const err = formik.errors.results?.[idx];
    return typeof err === "object" && field in err
      ? (err as any)[field]
      : undefined;
  };

  const totalPossibleScore = formik.values.questions.reduce(
    (tot, q) => tot + q.options.reduce((s, o) => s + (o.score || 0), 0),
    0,
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fef9c3 0%, #fce7f3 40%, #dbeafe 75%, #dcfce7 100%)",
      }}
    >
      <div className="absolute top-[-80px] left-[-80px] w-64 h-64 bg-yellow-300 rounded-full opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute top-20 right-[-60px] w-48 h-48 bg-pink-300 rounded-full opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-60px] right-20 w-56 h-56 bg-green-300 rounded-full opacity-20 animate-pulse pointer-events-none" />

      <div className="relative z-10">
        <div className="bg-white/85 backdrop-blur-sm border-b-4 border-yellow-300 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg text-2xl flex-shrink-0">
                  🧩
                </div>
                <div>
                  <h1
                    className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight"
                    style={{
                      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
                    }}
                  >
                    Build a Quiz!{" "}
                    <Sparkles className="inline w-6 h-6 text-yellow-500" />
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Create a fun assessment quiz 🎉
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
                {[
                  {
                    icon: "📝",
                    label: `${formik.values.questions.length} Questions`,
                    bg: "bg-blue-100 border-blue-300 text-blue-700",
                  },
                  {
                    icon: "⭐",
                    label: `${totalPossibleScore} pts`,
                    bg: "bg-yellow-100 border-yellow-300 text-yellow-700",
                  },
                  {
                    icon: "🏅",
                    label: `${formik.values.results?.length || 0} Outcomes`,
                    bg: "bg-pink-100 border-pink-300 text-pink-700",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 font-bold text-xs ${s.bg}`}
                  >
                    <span>{s.icon}</span> {s.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1 min-w-0 space-y-6">
                <div
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-5 sm:p-6"
                  style={{ border: "3px solid #fde047" }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-2xl flex items-center justify-center text-xl shadow flex-shrink-0">
                      🏷️
                    </div>
                    <div>
                      <h2
                        className="text-lg font-black text-slate-800"
                        style={{ fontFamily: "'Fredoka One', cursive" }}
                      >
                        Pick a Category!
                      </h2>
                      <p className="text-xs text-slate-500">
                        What kind of quiz are you making?
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CATEGORY_OPTIONS.map((opt) => {
                      const selected = formik.values.category === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => formik.setFieldValue("category", opt)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-left transition-all duration-150 ${
                            selected
                              ? "bg-yellow-100 text-yellow-800 shadow-md scale-105"
                              : "bg-slate-50 text-slate-700 hover:bg-yellow-50 hover:scale-102"
                          }`}
                          style={{
                            border: selected
                              ? "3px solid #facc15"
                              : "3px solid #e2e8f0",
                          }}
                        >
                          <span className="text-2xl">
                            {CATEGORY_EMOJIS[opt]}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {selected && (
                            <CheckCircle2 className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {formik.touched.category && formik.errors.category && (
                    <p className="mt-3 text-sm text-red-600 font-bold flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-xl">
                      <AlertCircle className="w-4 h-4" />{" "}
                      {formik.errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-xl shadow flex-shrink-0">
                      📋
                    </div>
                    <h2
                      className="text-lg font-black text-slate-800"
                      style={{ fontFamily: "'Fredoka One', cursive" }}
                    >
                      Questions{" "}
                      <span className="ml-1 bg-blue-100 text-blue-600 text-sm px-3 py-0.5 rounded-full border-2 border-blue-300 font-black">
                        {formik.values.questions.length}
                      </span>
                    </h2>
                  </div>

                  {formik.values.questions.map((q, qIdx) => {
                    const qErr = getQuestionError(qIdx);
                    const qScore = q.options.reduce(
                      (s, o) => s + (o.score || 0),
                      0,
                    );
                    const headerGrad = Q_HEADERS[qIdx % Q_HEADERS.length];
                    return (
                      <div
                        key={qIdx}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden"
                        style={{ border: "3px solid #e2e8f0" }}
                      >
                        <div
                          className={`bg-gradient-to-r ${headerGrad} px-5 py-4 flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/25 rounded-2xl flex items-center justify-center text-white font-black text-lg backdrop-blur-sm">
                              {qIdx + 1}
                            </div>
                            <div>
                              <span
                                className="text-white font-black text-base"
                                style={{ fontFamily: "'Fredoka One', cursive" }}
                              >
                                Question {qIdx + 1}
                              </span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Star className="w-3 h-3 text-yellow-200 fill-yellow-200" />
                                <span className="text-white/80 text-xs font-bold">
                                  {qScore} pts
                                </span>
                              </div>
                            </div>
                          </div>
                          {formik.values.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(qIdx)}
                              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/35 text-white px-3 py-2 rounded-xl text-xs font-black transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="p-5 sm:p-6 space-y-5">
                          <div>
                            <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
                              <Smile className="w-4 h-4 text-blue-500" /> What's
                              your question?
                            </label>
                            <textarea
                              value={q.question}
                              onChange={(e) =>
                                updateQuestion(qIdx, e.target.value)
                              }
                              onBlur={formik.handleBlur}
                              rows={3}
                              className="w-full px-4 py-3 text-sm font-medium rounded-2xl focus:outline-none resize-none transition-all bg-blue-50 focus:bg-white text-slate-700 placeholder-slate-400"
                              style={{
                                border:
                                  formik.touched.questions?.[qIdx]?.question &&
                                  qErr
                                    ? "3px solid #f87171"
                                    : "3px solid #bfdbfe",
                              }}
                              placeholder="✍️ Type your question here..."
                            />
                            {formik.touched.questions?.[qIdx]?.question &&
                              qErr && (
                                <p className="mt-1.5 text-xs text-red-600 font-bold flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-xl">
                                  <AlertCircle className="w-3.5 h-3.5" /> {qErr}
                                </p>
                              )}
                          </div>

                          <div>
                            <label className="block text-sm font-black text-slate-700 mb-3 flex items-center gap-2">
                              <span>🔤</span> Answer choices & star points
                            </label>
                            <div className="space-y-2.5">
                              {q.options.map((opt, oIdx) => {
                                const c =
                                  OPTION_COLORS[oIdx % OPTION_COLORS.length];
                                const txtErr = getOptionError(
                                  qIdx,
                                  oIdx,
                                  "text",
                                );
                                const scrErr = getOptionError(
                                  qIdx,
                                  oIdx,
                                  "score",
                                );
                                return (
                                  <div
                                    key={oIdx}
                                    className={`flex items-start gap-3 p-3 rounded-2xl border-2 transition-all ${c.wrap}`}
                                  >
                                    <div
                                      className={`w-8 h-8 ${c.badge} rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 mt-0.5 shadow-sm`}
                                    >
                                      {String.fromCharCode(65 + oIdx)}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-2">
                                      <div className="flex-1">
                                        <input
                                          type="text"
                                          value={opt.text}
                                          onChange={(e) =>
                                            updateOption(
                                              qIdx,
                                              oIdx,
                                              "text",
                                              e.target.value,
                                            )
                                          }
                                          onBlur={formik.handleBlur}
                                          className="w-full px-3 py-2 text-sm font-medium bg-white/70 border-2 border-white rounded-xl focus:outline-none focus:bg-white transition-all placeholder-slate-400"
                                          placeholder={`Option ${String.fromCharCode(65 + oIdx)} answer...`}
                                        />
                                        {formik.touched.questions?.[qIdx]
                                          ?.options?.[oIdx]?.text &&
                                          txtErr && (
                                            <p className="mt-1 text-xs text-red-600 font-bold">
                                              {txtErr}
                                            </p>
                                          )}
                                      </div>
                                      <div className="w-full sm:w-28 flex-shrink-0">
                                        <div className="flex items-center gap-1.5 bg-white/70 border-2 border-white rounded-xl px-2 py-2 focus-within:bg-white transition-all">
                                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400 flex-shrink-0" />
                                          <input
                                            type="number"
                                            value={opt.score}
                                            onChange={(e) =>
                                              updateOption(
                                                qIdx,
                                                oIdx,
                                                "score",
                                                e.target.value,
                                              )
                                            }
                                            onBlur={formik.handleBlur}
                                            className="w-full bg-transparent text-sm font-black text-slate-700 focus:outline-none text-center"
                                            placeholder="0"
                                          />
                                          <span className="text-xs text-slate-400 font-bold flex-shrink-0">
                                            pts
                                          </span>
                                        </div>
                                        {formik.touched.questions?.[qIdx]
                                          ?.options?.[oIdx]?.score &&
                                          scrErr && (
                                            <p className="mt-1 text-xs text-red-600 font-bold">
                                              {scrErr}
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 flex items-center justify-end gap-2 text-sm font-black text-amber-700 bg-amber-50 rounded-2xl px-4 py-2.5 border-2 border-amber-200">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              This question is worth {qScore} points!
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full py-4 rounded-3xl font-black text-base text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all flex items-center justify-center gap-3 group"
                    style={{ border: "3px dashed #93c5fd" }}
                  >
                    <div className="w-8 h-8 bg-blue-500 group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors shadow-md">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    ✨ Add Another Question!
                  </button>
                </div>

                <div
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-5 sm:p-6"
                  style={{ border: "3px solid #a7f3d0" }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-2xl flex items-center justify-center text-xl shadow flex-shrink-0">
                      📊
                    </div>
                    <div>
                      <h3
                        className="text-lg font-black text-slate-800"
                        style={{ fontFamily: "'Fredoka One', cursive" }}
                      >
                        Quiz Summary
                      </h3>
                      <p className="text-xs text-slate-500">Almost ready! 🎉</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      {
                        emoji: "🏷️",
                        label: "Category",
                        value: formik.values.category
                          ? formik.values.category.split(" ")[0]
                          : "Not set",
                        bg: "bg-yellow-50 border-yellow-200",
                      },
                      {
                        emoji: "📝",
                        label: "Questions",
                        value: String(formik.values.questions.length),
                        bg: "bg-blue-50 border-blue-200",
                      },
                      {
                        emoji: "⭐",
                        label: "Max Score",
                        value: String(totalPossibleScore),
                        bg: "bg-purple-50 border-purple-200",
                      },
                      {
                        emoji: "🏅",
                        label: "Outcomes",
                        value: String(formik.values.results?.length || 0),
                        bg: "bg-pink-50 border-pink-200",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`${item.bg} rounded-2xl p-3 text-center border-2`}
                      >
                        <div className="text-2xl mb-1">{item.emoji}</div>
                        <div className="text-lg font-black text-slate-800 truncate">
                          {item.value}
                        </div>
                        <div className="text-xs text-slate-500 font-bold">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`flex items-center gap-2 mb-4 px-4 py-2.5 rounded-2xl text-sm font-bold border-2 ${
                      formik.isValid
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {formik.isValid ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Your
                        quiz looks great! Ready to publish! 🚀
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> Fill
                        in all the fields above first! 👆
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-200 flex items-center justify-center gap-3 ${
                      formik.isValid && !formik.isSubmitting
                        ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg shadow-green-200 hover:scale-105 active:scale-100"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                    }`}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <span className="animate-spin text-xl">⏳</span> Saving
                        your quiz...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5" /> Publish My Quiz! 🎉
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="w-full xl:w-80 2xl:w-96 xl:flex-shrink-0">
                <div className="xl:sticky xl:top-24">
                  <div
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden"
                    style={{ border: "3px solid #f9a8d4" }}
                  >
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-white/25 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm flex-shrink-0">
                            🏆
                          </div>
                          <div>
                            <h2
                              className="text-white font-black text-sm"
                              style={{ fontFamily: "'Fredoka One', cursive" }}
                            >
                              Result Outcomes!
                            </h2>
                            <p className="text-pink-200 text-xs font-medium">
                              What do the scores mean?
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={addResultRange}
                          className="flex items-center gap-1.5 bg-white/25 hover:bg-white/40 text-white px-3 py-2 rounded-xl text-xs font-black transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add!
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="bg-pink-50 rounded-2xl px-4 py-3 mb-4 border-2 border-pink-100">
                        <p className="text-xs font-bold text-pink-700 flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3.5 h-3.5" /> Quick Tip
                        </p>
                        <p className="text-xs text-pink-600">
                          Total points:{" "}
                          <strong>{totalPossibleScore} pts</strong>. Make sure
                          your ranges cover 0 to {totalPossibleScore}!
                        </p>
                      </div>

                      {(formik.values.results?.length || 0) === 0 && (
                        <div className="text-center py-8">
                          <div className="text-5xl mb-3">🏅</div>
                          <p className="text-sm font-black text-slate-500">
                            No outcomes yet!
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Tap "Add!" to create score ranges
                          </p>
                        </div>
                      )}

                      <div className="space-y-3 max-h-[60vh] xl:max-h-[calc(100vh-380px)] overflow-y-auto">
                        {formik.values.results?.map((range, rIdx) => {
                          const theme =
                            RANGE_THEMES[rIdx % RANGE_THEMES.length];
                          const minErr = getResultError(rIdx, "minScore");
                          const maxErr = getResultError(rIdx, "maxScore");
                          const msgErr = getResultError(rIdx, "message");
                          return (
                            <div
                              key={rIdx}
                              className={`rounded-2xl border-2 overflow-hidden ${theme.card}`}
                            >
                              <div
                                className={`${theme.bar} flex items-center justify-between px-3 py-2.5`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{theme.emoji}</span>
                                  <span className="text-white font-black text-xs">
                                    Outcome {rIdx + 1}
                                  </span>
                                </div>
                                {(formik.values.results?.length || 0) > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeResultRange(rIdx)}
                                    className="bg-white/25 hover:bg-white/40 text-white p-1.5 rounded-lg transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="p-3 space-y-2.5">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1">
                                      Min ⬇️
                                    </label>
                                    <input
                                      type="number"
                                      value={range.minScore}
                                      onChange={(e) =>
                                        updateResult(
                                          rIdx,
                                          "minScore",
                                          e.target.value,
                                        )
                                      }
                                      onBlur={formik.handleBlur}
                                      className={`w-full px-2.5 py-2 border-2 rounded-xl focus:outline-none text-sm font-black text-center bg-white/80 focus:bg-white transition-all ${minErr ? "border-red-400" : "border-white"}`}
                                      placeholder="0"
                                    />
                                    {minErr && (
                                      <p className="mt-1 text-xs text-red-600 font-bold">
                                        {minErr}
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1">
                                      Max ⬆️
                                    </label>
                                    <input
                                      type="number"
                                      value={range.maxScore}
                                      onChange={(e) =>
                                        updateResult(
                                          rIdx,
                                          "maxScore",
                                          e.target.value,
                                        )
                                      }
                                      onBlur={formik.handleBlur}
                                      className={`w-full px-2.5 py-2 border-2 rounded-xl focus:outline-none text-sm font-black text-center bg-white/80 focus:bg-white transition-all ${maxErr ? "border-red-400" : "border-white"}`}
                                      placeholder={String(totalPossibleScore)}
                                    />
                                    {maxErr && (
                                      <p className="mt-1 text-xs text-red-600 font-bold">
                                        {maxErr}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-black text-slate-600 mb-1">
                                    Message 💬
                                  </label>
                                  <textarea
                                    value={range.message}
                                    onChange={(e) =>
                                      updateResult(
                                        rIdx,
                                        "message",
                                        e.target.value,
                                      )
                                    }
                                    onBlur={formik.handleBlur}
                                    rows={2}
                                    className={`w-full px-3 py-2 border-2 rounded-xl focus:outline-none text-xs font-medium resize-none bg-white/80 focus:bg-white transition-all ${msgErr ? "border-red-400" : "border-white"}`}
                                    placeholder="Message kids will see for this score..."
                                  />
                                  {msgErr && (
                                    <p className="mt-1 text-xs text-red-600 font-bold">
                                      {msgErr}
                                    </p>
                                  )}
                                </div>

                                <div className="bg-white/60 rounded-xl px-3 py-2 text-xs">
                                  <span className="font-black text-slate-500">
                                    Preview:{" "}
                                  </span>
                                  <span className="font-black text-slate-700">
                                    {range.minScore}–{range.maxScore} pts
                                  </span>
                                  <span className="mx-1 text-slate-400">→</span>
                                  <span className="italic text-slate-600">
                                    {range.message || "No message yet..."}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {formik.errors.results &&
                        typeof formik.errors.results === "string" && (
                          <p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1 bg-red-50 px-3 py-2 rounded-xl">
                            <AlertCircle className="w-3.5 h-3.5" />{" "}
                            {formik.errors.results}
                          </p>
                        )}

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-pink-50 border-2 border-pink-100 rounded-2xl p-3 text-center">
                          <div className="text-xl">⭐</div>
                          <div className="text-lg font-black text-slate-800">
                            {totalPossibleScore}
                          </div>
                          <div className="text-xs text-slate-500 font-bold">
                            Max Points
                          </div>
                        </div>
                        <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-3 text-center">
                          <div className="text-xl">🏅</div>
                          <div className="text-lg font-black text-slate-800">
                            {formik.values.results?.length || 0}
                          </div>
                          <div className="text-xs text-slate-500 font-bold">
                            Outcomes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;
``