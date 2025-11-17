import { Trash2, Plus } from "lucide-react";
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
    const newQ = formik.values.questions.filter((_, i) => i !== index);
    formik.setFieldValue("questions", newQ);
  };

  const updateQuestion = (qIdx: number, val: string) =>
    formik.setFieldValue(`questions[${qIdx}].question`, val);

  const updateOption = (
    qIdx: number,
    oIdx: number,
    field: "text" | "score",
    val: string | number
  ) => {
    const value = field === "score" ? Number(val) || 0 : val;
    formik.setFieldValue(`questions[${qIdx}].options[${oIdx}].${field}`, value);
  };

  const getQuestionError = (qIdx: number) => {
    const err = formik.errors.questions?.[qIdx];
    return typeof err === "object" && "question" in err
      ? err.question
      : undefined;
  };

  const getOptionError = (
    qIdx: number,
    oIdx: number,
    field: "text" | "score"
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

  const removeResultRange = (idx: number) => {
    const newRes = (formik.values.results || []).filter((_, i) => i !== idx);
    formik.setFieldValue("results", newRes);
  };

  const updateResult = (
    idx: number,
    field: "minScore" | "maxScore" | "message",
    val: string | number
  ) => {
    const value = field === "message" ? val : Number(val);
    formik.setFieldValue(`results[${idx}].${field}`, value);
  };

  const getResultError = (
    idx: number,
    field: "minScore" | "maxScore" | "message"
  ) => {
    const err = formik.errors.results?.[idx];
    return typeof err === "object" && field in err
      ? (err as any)[field]
      : undefined;
  };

  const totalPossibleScore = formik.values.questions.reduce(
    (tot, q) => tot + q.options.reduce((s, o) => s + (o.score || 0), 0),
    0
  );

  const getRangeColor = (idx: number) => {
    const colors = [
      "border-green-400 bg-green-50",
      "border-yellow-400 bg-yellow-50",
      "border-orange-400 bg-orange-50",
      "border-red-400 bg-red-50",
      "border-purple-400 bg-purple-50",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Create New Quiz
          </h1>
          <div className="flex gap-4 text-sm">
            <div className="bg-sky-100 px-4 py-2 rounded">
              <span className="font-semibold text-sky-700">
                Total Questions:{" "}
              </span>
              <span className="text-sky-900 font-bold text-lg">
                {formik.values.questions.length}
              </span>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded">
              <span className="font-semibold text-green-700">Category: </span>
              <span className="text-green-900 font-bold">
                {formik.values.category || "Not Set"}
              </span>
            </div>
            <div className="bg-purple-100 px-4 py-2 rounded">
              <span className="font-semibold text-purple-700">
                Result Ranges:{" "}
              </span>
              <span className="text-purple-900 font-bold text-lg">
                {formik.values.results?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex gap-6">
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Quiz Category
                </h2>
                <select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none ${
                    formik.touched.category && formik.errors.category
                      ? "border-red-500"
                      : "border-sky-200 focus:border-sky-500"
                  }`}
                >
                  <option value="" disabled>
                    -- Select a category --
                  </option>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.category}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 bg-white rounded-lg shadow p-4">
                  Questions ({formik.values.questions.length})
                </h2>

                {formik.values.questions.map((q, qIdx) => {
                  const qErr = getQuestionError(qIdx);
                  return (
                    <div
                      key={qIdx}
                      className="bg-white rounded-lg shadow p-6 border-l-4 border-sky-500"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-sky-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                            {qIdx + 1}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Question #{qIdx + 1}
                          </h3>
                        </div>
                        {formik.values.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIdx)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        )}
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Question Text:
                        </label>
                        <textarea
                          value={q.question}
                          onChange={(e) => updateQuestion(qIdx, e.target.value)}
                          onBlur={formik.handleBlur}
                          rows={3}
                          className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none ${
                            formik.touched.questions?.[qIdx]?.question && qErr
                              ? "border-red-500"
                              : "border-gray-300 focus:border-sky-500"
                          }`}
                          placeholder="Type your question here..."
                        />
                        {formik.touched.questions?.[qIdx]?.question && qErr && (
                          <p className="mt-1 text-sm text-red-600">{qErr}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Answer Options & Scores:
                        </label>
                        <div className="bg-sky-100 rounded-t-lg px-4 py-3 grid grid-cols-12 gap-4 font-bold text-gray-700">
                          <div className="col-span-1">Option</div>
                          <div className="col-span-8">Answer Text</div>
                          <div className="col-span-3 text-center">
                            Score Points
                          </div>
                        </div>

                        <div className="border-2 border-sky-100 rounded-b-lg">
                          {q.options.map((opt, oIdx) => {
                            const txtErr = getOptionError(qIdx, oIdx, "text");
                            const scrErr = getOptionError(qIdx, oIdx, "score");
                            return (
                              <div
                                key={oIdx}
                                className="px-4 py-3 grid grid-cols-12 gap-4 items-center border-b border-sky-100 last:border-b-0 hover:bg-sky-50"
                              >
                                <div className="col-span-1">
                                  <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold">
                                    {String.fromCharCode(65 + oIdx)}
                                  </div>
                                </div>

                                <div className="col-span-8">
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) =>
                                      updateOption(
                                        qIdx,
                                        oIdx,
                                        "text",
                                        e.target.value
                                      )
                                    }
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 py-2 border-2 rounded focus:outline-none ${
                                      formik.touched.questions?.[qIdx]
                                        ?.options?.[oIdx]?.text && txtErr
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-sky-500"
                                    }`}
                                    placeholder={`Enter option ${oIdx + 1}`}
                                  />
                                  {formik.touched.questions?.[qIdx]?.options?.[
                                    oIdx
                                  ]?.text &&
                                    txtErr && (
                                      <p className="mt-1 text-xs text-red-600">
                                        {txtErr}
                                      </p>
                                    )}
                                </div>

                                <div className="col-span-3">
                                  <input
                                    type="number"
                                    value={opt.score}
                                    onChange={(e) =>
                                      updateOption(
                                        qIdx,
                                        oIdx,
                                        "score",
                                        e.target.value
                                      )
                                    }
                                    onBlur={formik.handleBlur}
                                    className={`w-full px-3 py-2 border-2 rounded focus:outline-none text-center font-bold text-lg ${
                                      formik.touched.questions?.[qIdx]
                                        ?.options?.[oIdx]?.score && scrErr
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-sky-500"
                                    }`}
                                    placeholder="0"
                                  />
                                  {formik.touched.questions?.[qIdx]?.options?.[
                                    oIdx
                                  ]?.score &&
                                    scrErr && (
                                      <p className="mt-1 text-xs text-red-600">
                                        {scrErr}
                                      </p>
                                    )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <span className="font-semibold">
                            Total Possible Points for this Question:{" "}
                          </span>
                          <span className="font-bold text-sky-600 text-lg">
                            {q.options.reduce((s, o) => s + (o.score || 0), 0)}{" "}
                            points
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-4 bg-sky-500 text-white rounded-lg font-bold text-lg hover:bg-sky-600 flex items-center justify-center gap-2 shadow"
                >
                  <Plus className="w-6 h-6" /> Add New Question
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Quiz Summary:
                </h3>
                <div className="space-y-1 text-gray-700">
                  <p>
                    Category:{" "}
                    <span className="font-bold">
                      {formik.values.category || "Not Set"}
                    </span>
                  </p>
                  <p>
                    Total Questions:{" "}
                    <span className="font-bold">
                      {formik.values.questions.length}
                    </span>
                  </p>
                  <p>
                    Total Possible Score:{" "}
                    <span className="font-bold text-sky-600">
                      {totalPossibleScore} points
                    </span>
                  </p>
                  <p>
                    Result Ranges:{" "}
                    <span className="font-bold text-purple-600">
                      {formik.values.results?.length || 0}
                    </span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                  className={`mt-6 w-full py-4 rounded-lg font-bold text-xl shadow-lg transition-colors ${
                    formik.isValid
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Submit Quiz
                </button>
              </div>
            </div>

            <div className="w-96 space-y-6 sticky top-6 self-start">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Result Ranges
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Define score ranges & messages
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addResultRange}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 flex items-center gap-1 font-semibold shadow text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Quick Guide:</p>
                    <ul className="space-y-1 ml-2">
                      <li>
                        • Total score:{" "}
                        <strong className="text-blue-600">
                          {totalPossibleScore} pts
                        </strong>
                      </li>
                      <li>• Cover all scores (0-{totalPossibleScore})</li>
                      <li>• No gaps between ranges</li>
                    </ul>
                  </div>
                </div>

                {formik.values.results?.length === 0 && (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    No ranges added yet
                  </p>
                )}

                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {formik.values.results?.map((range, rIdx) => {
                    const minErr = getResultError(rIdx, "minScore");
                    const maxErr = getResultError(rIdx, "maxScore");
                    const msgErr = getResultError(rIdx, "message");
                    return (
                      <div
                        key={rIdx}
                        className={`border-2 rounded-lg p-3 ${getRangeColor(
                          rIdx
                        )}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {rIdx + 1}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              Range {rIdx + 1}
                            </span>
                          </div>
                          {formik.values.results!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeResultRange(rIdx)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Min Score
                              </label>
                              <input
                                type="number"
                                value={range.minScore}
                                onChange={(e) =>
                                  updateResult(rIdx, "minScore", e.target.value)
                                }
                                onBlur={formik.handleBlur}
                                className={`w-full px-2 py-1.5 border-2 rounded focus:outline-none font-semibold text-sm ${
                                  minErr
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-indigo-500"
                                }`}
                                placeholder="0"
                              />
                              {minErr && (
                                <p className="mt-0.5 text-xs text-red-600">
                                  {minErr}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Max Score
                              </label>
                              <input
                                type="number"
                                value={range.maxScore}
                                onChange={(e) =>
                                  updateResult(rIdx, "maxScore", e.target.value)
                                }
                                onBlur={formik.handleBlur}
                                className={`w-full px-2 py-1.5 border-2 rounded focus:outline-none font-semibold text-sm ${
                                  maxErr
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-indigo-500"
                                }`}
                                placeholder={totalPossibleScore.toString()}
                              />
                              {maxErr && (
                                <p className="mt-0.5 text-xs text-red-600">
                                  {maxErr}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Result Message
                            </label>
                            <textarea
                              value={range.message}
                              onChange={(e) =>
                                updateResult(rIdx, "message", e.target.value)
                              }
                              onBlur={formik.handleBlur}
                              rows={3}
                              className={`w-full px-2 py-2 border-2 rounded focus:outline-none text-sm ${
                                msgErr
                                  ? "border-red-500"
                                  : "border-gray-300 focus:border-indigo-500"
                              }`}
                              placeholder="Message for this score range..."
                            />
                            {msgErr && (
                              <p className="mt-0.5 text-xs text-red-600">
                                {msgErr}
                              </p>
                            )}
                          </div>

                          <div className="bg-white bg-opacity-60 p-2 rounded border border-gray-300">
                            <p className="text-xs">
                              <span className="font-semibold">Preview:</span>{" "}
                              Score
                              <span className="font-bold text-indigo-600 mx-1">
                                {range.minScore}-{range.maxScore}
                              </span>
                              →{" "}
                              <span className="italic text-gray-700">
                                "{range.message || "No message"}"
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {formik.errors.results &&
                  typeof formik.errors.results === "string" && (
                    <p className="text-xs text-red-600 mt-2">
                      {formik.errors.results}
                    </p>
                  )}

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mt-4">
                  <h3 className="font-bold text-indigo-900 mb-2 text-sm">
                    Summary:
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Total Score:</span>
                      <span className="font-bold text-indigo-900">
                        {totalPossibleScore} pts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Ranges:</span>
                      <span className="font-bold text-indigo-900">
                        {formik.values.results?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
