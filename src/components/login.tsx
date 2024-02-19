'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import ImageForLargeScreen from '../assets/login.png';
import { signIn, signUp } from '@/app/firebase/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BeatLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Login = () => {
  const [isRegister, setRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState('female'); 

  const router = useRouter();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '',gender:'female' },
    validationSchema: Yup.object({
      name: isRegister ? Yup.string().required('Name is required') : Yup.string(),
      gender: isRegister  ? Yup.string().required('Name is required') : Yup.string(),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isRegister) { await signUp(values.email, values.password, values.name, gender == "female" ? "girl" : "boy");
          router.push('/home');
        } else { 
           await signIn(values.email, values.password) 

          router.push('/home');
        }
        // Handle successful authentication or registration
        toast.info('Authentication successful')
      } catch (error: any) {
        toast.error(error?.message || 'something went wrong');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleToggle = () => {
    setRegister(!isRegister);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  return (
    <div className="flex w-full h-full">
      <div className="hidden lg:block w-1/2 relative">
        <Image src={ImageForLargeScreen} alt="Large Screen Image" layout="fill" objectFit="cover" />
      </div>

      <div className="w-full h-screen lg:w-1/2 p-8 flex items-center justify-center">
        <form onSubmit={formik.handleSubmit}>
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Welcome</h2>
            <p className="text-xs font-bold mb-4">
              {isRegister ? 'Sign up by entering the information below' : 'Sign in by entering the information below'}
            </p>

            {isRegister && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  className="border rounded w-80 py-2 px-3"
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-xs bold mt-1">{formik.errors.name}</div>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="border rounded w-80 py-2 px-3"
                type="email"
                id="email"
                placeholder="Enter your email"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-400 text-xs bold mt-1">{formik.errors.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="border rounded py-2 px-3 w-80"
                type="password"
                id="password"
                placeholder="Enter your password"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs bold mt-1">{formik.errors.password}</div>
              )}
            </div>

            {isRegister && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="female"
                      checked={gender === 'female'}
                      onChange={handleGenderChange}
                      className="form-radio h-5 w-5 text-teal-500 focus:ring-transparent focus:border-transparent focus:ring-offset-transparent"
                    />
                    <span className="ml-2 text-gray-700">female</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="male"
                      checked={gender === 'male'}
                      onChange={handleGenderChange}
                      className="form-radio h-5 w-5 text-teal-500 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <span className="ml-2 text-gray-700">Male</span>
                  </label>
                </div>
              </div>
            )}


            <button
              type='submit'
              className="bg-teal-500 text-white py-2 px-4 rounded-md w-80"
              disabled={loading}
            >
              {loading ? (
                <BeatLoader color="#ffffff" loading={loading} />
              ) : (
                isRegister ? 'Sign Up' : 'Login'
              )}
            </button>

            <p className="mt-4">
              {isRegister
                ? 'Already have an account?'
                : "Don't have an account?"}{' '}
              <button className="text-teal-500" onClick={handleToggle}>
                {isRegister ? 'Login here' : 'Register here'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
