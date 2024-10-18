
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    role: "",
    email: "",
    password: "",
    error: null,
  });

  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setData({ ...data, error: "Email is required" });
      return;
    }
    if (!password) {
      setData({ ...data, error: "Password is required" });
      return;
    }
    if (password.length < 5 || password.length > 8) {
      setData({ ...data, error: "Password must be 5 - 8 characters" });
      return;
    }
    try {
      setData({ ...data, error: null });
      const res = await axios.post('http://localhost:5000/user/login',
        { email, password },
        config
      );
      localStorage.setItem("token", res.data.token);
      setData({ ...data, email: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      setData({
        ...data,
        error: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  const { role, email, password, error } = data;
  const showPass = showPassword;

  return (
    <div className='bg-form bg-no-repeat bg-cover bg-center flex justify-center items-center py-10 px-3'>
      <div className='px-8 py-5 backdrop-blur-xl md:w-2/4 w-full flex flex-col justify-center items-start gap-3 shadow-2xl rounded-[30px] border-2 border-green'>
        <div className='flex items-center justify-center gap-3 mx-auto'>
          <img src="./logo.png" alt="TechHire logo" className='md:w-28 w-16' />
          <h1 className='md:text-3xl text-xl'>CollabHub</h1>
        </div>
        <h4 className='text-black text-sm font-bold mt-3'>Login as:</h4>
        <div className='flex justify-start items-center flex-wrap gap-4'>
          <label className='flex gap-1'>
            <input
              type="radio"
              name="role"
              value='admin'
              checked={role === 'admin'}
              onChange={handleChange}
            />
            <span>Admin</span>
          </label>
          <label className='flex gap-1'>
            <input
              type="radio"
              name="role"
              value='team lead'
              checked={role === 'team lead'}
              onChange={handleChange}
            />
            <span>Team Lead</span>
          </label>
          <label className='flex gap-1'>
            <input
              type="radio"
              name="role"
              value='team member'
              checked={role === 'team member'}
              onChange={handleChange}
            />
            <span>Team Member</span>
          </label>
        </div>
        <form className='flex flex-col gap-4 mt-4 w-full '>
          {error ? <p className=" text-red-500">{error}</p> : null}
          <div className="w-full rounded-lg font-mono">
            <label className="block text-black text-sm font-bold mb-2">Email</label>
            <input
              className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-green hover:shadow-lg hover:border-green bg-gray-100"
              placeholder="Enter email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div className="w-full rounded-lg font-mono">
            <label className="block text-black text-sm font-bold mb-2">Password</label>
            <input
              className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-green hover:shadow-lg hover:border-green bg-gray-100"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className='flex justify-between mb-4 flex-wrap'>
            <div className='flex justify-start items-center gap-1'>
              <input
                type="checkbox"
                name="showPass"
                id="showPass"
                checked={showPass}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPass">Show password</label>
            </div>
          </div>

          <div
            className="w-full h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
          >
            <button className="px-5 py-2" onClick={handleLogin}>Login</button>
          </div>
        </form>
        <div className='w-full mt-5 relative'>
          <hr className='w-full fill-black' />
          <p className='bg bg-white px-2 absolute -top-3 left-[48%]'>OR</p>
        </div>
        <div className='mx-auto mt-2'>
          Don't have an account? <Link to='/verifyOTP' className='hover:underline'>Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
