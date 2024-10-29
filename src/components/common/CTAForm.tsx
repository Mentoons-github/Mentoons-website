import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  type: Yup.string().required("Type is required"),
  commonFeild: Yup.string().required("This field is required"),
  message: Yup.string().required("Message is required"),
});

type FormValues = {
  name: string;
  email: string;
  type: string;
  commonField: string;
  message: string;
};

const CTAForm: React.FC = () => {
  // console.log(import.meta.env.VITE_EMAIL_JS_SERVICE_ID,'ppp')
  const sendEmail = (values: FormValues) => {
    emailjs
      .send(
        import.meta.env.VITE_EMAIL_JS_SERVICE_ID,
        import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID,
        values,
        import.meta.env.VITE_EMAIL_JS_USER_ID
      )
      .then((result) => {
        console.log(result.text);
        console.log("Message sent successfully!");
      })
      .catch((error) => {
        console.log(error.text);
        console.log("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="p-4 max-w-md mx-auto rounded-lg h-full">
      <Formik<FormValues>
        initialValues={{
          name: "",
          email: "",
          type: "",
          commonField: "",
          message: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          sendEmail(values);
          console.log(values);
        }}
      >
        {({ values }) => (
          <Form>
            <div className="mb-4">
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="cta-input w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-3 ml-4"
              />
            </div>
            <div className="mb-4">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="cta-input w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-3 ml-4"
              />
            </div>
            <div className="mb-4">
              <Field
                as="select"
                name="type"
                className="cta-input w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select type</option>
                <option value="Workshop">Workshop</option>
                <option value="Inquiry">Inquiry</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-red-500 text-sm mt-3 ml-4"
              />
            </div>
            <div className="mb-4">
              <Field
                type="text"
                name="commonField"
                placeholder={
                  values.type === "Workshop" ? "Meetup group" : "Subject"
                }
                className="cta-input w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="commonField"
                component="div"
                className="text-red-500 text-sm mt-3 ml-4"
              />
            </div>
            <div className="mb-4">
              <Field
                as="textarea"
                name="message"
                placeholder="Message"
                className="cta-input w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="message"
                component="div"
                className="text-red-500 text-sm mt-3 ml-4"
              />
            </div>
            <button type="submit" className="cta-button">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CTAForm;
