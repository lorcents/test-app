'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import ImageForLargeScreen from '../assets/login.png';
import { signIn, signUp } from '@/app/firebase/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BeatLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import {toast} from 'react-toastify';
import { UserCredential } from 'firebase/auth';

const Login = () => {
  const [isRegister, setRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: isRegister ? Yup.string().required('Name is required') : Yup.string(),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isRegister) {
          const x = await signUp(values.email, values.password) as {result: UserCredential | null;
            error: {message:string };}
          if (x.error) throw new Error(x.error?.message)
          router.push('/home');
        } else {
        const x =  await signIn(values.email, values.password) as {result: UserCredential | null;
          error: {message:string };}
        console.log(x)
        if (x.error) throw new Error(x.error?.message)
        
        router.push('/home');
        }
        // Handle successful authentication or registration
        toast.info('Authentication successful')
      } catch (error:any) {
        toast.error(error?.message  || 'something went wrong');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleToggle = () => {
    setRegister(!isRegister);
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

          <button
          type='submit'
            className="bg-teal-500 text-white py-2 px-4 rounded-md w-80"
            disabled={loading}
          >
            {loading ? (
              <BeatLoader color="#ffffff" loading={loading}  />
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
