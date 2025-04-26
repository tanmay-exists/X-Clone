import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import {toast} from 'react-hot-toast'

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

  const queryClient = useQueryClient()

  const {mutate: loginMutation, isError, isPending, error} = useMutation({
    mutationFn: async ({username, password}) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, password}),
        })

        const data = await res.json()
        if(!res.ok){
          throw new Error(data.error || 'Something went wrong')
        }
        return data

      } catch (error) {
        throw new Error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]})
    }
  })

	const handleSubmit = (e) => {
		e.preventDefault();
    loginMutation(formData)
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			{/* Left side - Logo */}
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>

			{/* Right side - Login Form */}
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					{/* Small screen logo */}
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>

					{/* Input Fields */}
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='Username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					{/* Login Button */}
					<button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-lg w-full'>
            {isPending ? 'Loading...' : 'Login'}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>

				{/* Signup Option */}
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-bold py-2 px-4 rounded-full text-lg w-full'>
							Sign up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
