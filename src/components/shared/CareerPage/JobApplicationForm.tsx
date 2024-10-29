import React, { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { signUpUser } from "../../api/userApi.js";
// import { useAuth } from "../../contexts/AuthContext.jsx";
// import { UserValidation } from "../../validators";
interface FormData {
  name: string;
  email: string;
  address: string;
  password: string;
}

interface FormError {
  [key: string]: string;
}

const JobApplicationForm = () => {
  // const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [formError] = React.useState<FormError>({});
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: FormEvent) => {
    console.log(e);

    
  };
  return (
    <div className='border px-8 py-12 rounded-2xl max-w-md w-[80%] mx-8 my-auto'>
      <h1 className='text-4xl font-bold my-2 mb-4'>Sign Up</h1>
      <p className='text-lg font-normal  mb-4 '>Your Feedback Matters.</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='w-[100%] flex flex-col'>
          <input
            type='text'
            name='name'
            onChange={handleChange}
            placeholder='name'
            autoComplete='off'
            className='p-3 text-base outline-none border bg-transparent text-white mb-4 rounded-lg'
          />
          {formError?.name && (
            <p className='text-red-500 text-sm font-normal mb-3'>
              {formError?.name}
            </p>
          )}
        </div>
        <div className='w-[100%] flex flex-col'>
          <input
            type='text'
            name='email'
            onChange={handleChange}
            placeholder='Email'
            autoComplete='off'
            className='p-3 text-base outline-none border bg-transparent text-white mb-4 rounded-lg'
          />
          {formError.email && (
            <p className='text-red-500 text-sm font-normal mb-3'>
              {formError.email}
            </p>
          )}
        </div>
        <div className='w-[100%] flex flex-col'>
          <input
            type='text'
            name='address'
            onChange={handleChange}
            placeholder='Address'
            autoComplete='off'
            className='p-3 text-base outline-none border bg-transparent text-white mb-4 rounded-lg'
          />
          {formError.address && (
            <p className='text-red-500 text-sm font-normal mb-3'>
              {formError.address}
            </p>
          )}
        </div>
        <div className='w-[100%] flex flex-col'>
          <input
            type='password'
            name='password'
            onChange={handleChange}
            placeholder='Password'
            autoComplete='false'
            className='p-3 text-base outline-none border bg-transparent text-white mb-4 rounded-lg'
          />
          {formError.password && (
            <p className='text-red-500 text-sm font-normal mb-3'>
              {formError.password}
            </p>
          )}
        </div>
        <button
          type='submit'
          className='p-3 text-base font-semibold outline-none border-none bg-white text-black cursor-pointer mb-4 rounded-lg'
        >
          {" "}
          Submit
        </button>
        <p className='text-base font-normal'>
          Already have an accout?{" "}
          <span
            onClick={() => navigate("/sign-in")}
            className='text-base underline cursor-pointer text-amber-500'
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default JobApplicationForm;
