import * as yup from "yup";

interface Option {
  text: string;
  score: number;
}

interface Question {
  question: string;
  options: Option[];
}

interface Result {
  minScore: number;
  maxScore: number;
  message: string;
}

export interface Quiz {
  category: string;
  questions: Question[];
  results: Result[];
}

export const quizInitialValues: Quiz = {
  category: "",
  questions: [
    {
      question: "",
      options: [
        { text: "", score: 0 },
        { text: "", score: 0 },
        { text: "", score: 0 },
      ],
    },
  ],
  results: [],
};

export const quizValidationSchema = yup.object({
  category: yup
    .string()
    .required("Category is required")
    .min(3, "Category must be at least 3 characters"),

  questions: yup
    .array()
    .of(
      yup.object({
        question: yup
          .string()
          .required("Question is required")
          .min(5, "Question must be at least 5 characters long"),

        options: yup
          .array()
          .of(
            yup.object({
              text: yup
                .string()
                .required("Option text is required")
                .min(1, "Option cannot be empty"),
              score: yup
                .number()
                .typeError("Score must be a number")
                .required("Score is required"),
            })
          )
          .length(3, "Each question must have exactly 3 options"),
      })
    )
    .min(1, "At least one question is required"),

  results: yup
    .array()
    .of(
      yup.object({
        minScore: yup
          .number()
          .typeError("Min score must be a number")
          .required("Min score is required")
          .min(0, "Min score cannot be negative"),
        maxScore: yup
          .number()
          .typeError("Max score must be a number")
          .required("Max score is required")
          .min(0, "Max score cannot be negative")
          .test(
            "is-greater",
            "Max score must be greater than or equal to min score",
            function (value) {
              const { minScore } = this.parent;
              return value >= minScore;
            }
          ),
        message: yup
          .string()
          .required("Result message is required")
          .min(5, "Message must be at least 5 characters long"),
      })
    )
    .min(1, "At least one result range is required")
    .test(
      "no-gaps",
      "Result ranges must cover all possible scores without gaps",
      function (results) {
        if (!results || results.length === 0) return true;

        const sorted = [...results].sort((a, b) => a.minScore - b.minScore);

        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].maxScore + 1 !== sorted[i + 1].minScore) {
            return false;
          }
        }

        return true;
      }
    ),
});
