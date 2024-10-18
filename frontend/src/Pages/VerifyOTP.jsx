import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const VerifyOTP = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(""); 
    const [verifyOtp, setVerifyOtp] = useState("");
    const [error, setError] = useState(null); 
    const [message, setMessage] = useState(null); 
    const navigate = useNavigate();

    const sendOTP = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/sendOTP', { email });
            setOtp(res.data.code);
            console.log(res.data.code);
            setMessage("OTP has been sent to your email");
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
            setMessage(null);        }
    };

    const handleOTP = async (e) => {
        e.preventDefault();
        
        if (!verifyOtp) {
            setError("OTP is required");
            return;
        }

        if (verifyOtp == otp) {
            setError(null);
            navigate('/register', { state: { email: email } });
        } else {
            setError('OTP does not match.');
            setMessage(null);
        }
    };

    return (
        <div className='bg-form bg-no-repeat bg-cover bg-center flex justify-center items-center py-20 px-5'>
            <div className='flex justify-center items-center backdrop-blur-xl flex-col gap-4 p-4 md:w-2/4 w-full shadow-2xl rounded-[30px] border-2 border-green'>
                <div className='flex items-center justify-center gap-3 mx-auto'>
                    <img src="./logo.png" alt="collabhub logo" className='md:w-28 w-16' />
                    <h1 className='md:text-4xl text-xl text-green'>Verify OTP</h1>
                </div>
                <p className='text-black text-sm font-bold mt-3 text-justify'>
                    Email verification is compulsory for registration.
                </p>
                <form className='flex flex-col gap-4 mt-5 w-full'>
                    {error && <p className="text-red-500">{error}</p>}
                    {message && <p className="text-green-500">{message}</p>}
                    
                    <div className="w-full rounded-lg font-mono flex gap-4 ">
                        <input
                            className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-green hover:shadow-lg hover:border-green bg-gray-100"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your Email'
                        />
                        <div
                            className="w-36 h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
                        >
                            <button className="px-5 py-2" onClick={sendOTP}>Send OTP</button>
                        </div>
                    </div>

                    <div className="w-full rounded-lg font-mono my-5">
                        <label className="block text-black text-sm font-bold mb-2">Enter OTP here</label>
                        <input
                            className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-green hover:shadow-lg hover:border-green  bg-gray-100"
                            placeholder="Enter OTP"
                            type="text"
                            value={verifyOtp}
                            onChange={(e) => setVerifyOtp(e.target.value)}
                        />
                    </div>
                    <div
                        className="w-full h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
                    >
                        <button className="px-5 py-2" onClick={handleOTP}>Verify</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
