import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const verifiedEmail = location.state?.email || '';

  const [data, setData] = useState({
    name: "",
    email: verifiedEmail,
    password: "",
    role: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name) {
      setData({ ...data, error: "Name is required" });
      return;
    }
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
    if (!role) {
      setData({ ...data, error: "Please select a role" });
      return;
    }
    try {
      setData({ ...data, error: null });
      await axios.post('http://localhost:5000/user/register',
        { name, email, password, role },
        config
      );
      setData({ ...data, name: "", email: "", password: "", role: "" });
      navigate("/login");
    } catch (err) {
      setData({ ...data, error: err.response.data.error });
    }
  };

  const { name, email, password, role, error } = data;
  const showPass = showPassword;

  return (
    <div className='bg-form bg-no-repeat bg-cover bg-center flex justify-center items-center py-10 px-3'>
      <div className='px-8 py-5 backdrop-blur-xl md:w-2/4 w-full flex flex-col justify-center items-start gap-3 shadow-2xl rounded-[30px] border-2 border-green'>
        <div className='flex items-center justify-center gap-3 mx-auto'>
          <img src="./logo.png" alt="TechHire logo" className='md:w-28 w-16' />
          <h1 className='md:text-3xl text-xl'>CollabHub</h1>
        </div>
        <h4 className='text-black text-sm font-bold mt-3'>Register as:</h4>
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
            <label className="block text-black text-sm font-bold mb-2">Name</label>
            <input
              className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-green hover:shadow-lg hover:border-green bg-gray-100"
              placeholder="Enter name"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>
          <div className="w-full rounded-lg font-mono">
            <label className="block text-black text-sm font-bold mb-2">Email</label>
            <input
              className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-green hover:shadow-lg hover:border-green bg-gray-100"
              placeholder="Enter email"
              type="email"
              name="email"
              value={email}
              disabled
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
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPass">Show password</label>
            </div>
          </div>

          <div
            className="w-full h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
          >
            <button className="px-5 py-2" onClick={handleRegister}>Register</button>
          </div>
        </form>
        <div className='w-full mt-5 relative'>
          <hr className='w-full fill-black' />
          <p className='bg bg-white px-2 absolute -top-3 left-[48%]'>OR</p>
        </div>
        <div className='mx-auto mt-2'>
          Already have an account? <Link to='/login' className='hover:underline'>Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
