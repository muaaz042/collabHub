import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoCloseOutline } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import axios from "axios";


const Navbar = () => {
    const navigate = useNavigate();
    const [isMenu, setMenu] = useState(false);
    const [user, setUser] = useState(null);


    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            const res = await axios.get('http://localhost:5000/user/me', {
                headers: { Authorization: `collabHub ${token}` },
            });
            setUser(res.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getUser();
        }
    }, [navigate]);

    const logOut = () => {
        localStorage.removeItem("token");
        setUser(null)
        navigate("/");
    };


    return (
        <div className={`w-full lg:px-20 md:px-12 sm:px-8 px-5 py-2 flex justify-between items-center transition-colors duration-300 bg-white text-black`}>
            <Link to='/' className='flex items-center justify-center gap-2 '>
                <img src="./logo.png" alt="TechHire logo" className='w-16' />
                <h1 className='text-2xl font-semibold text-green'>CollabHub</h1>
            </Link>
            {user ? (
                <section className="md:flex justify-center items-center gap-4 drop-shadow-xl hidden">
                    <p>
                        Welcome, <span className="font-bold font-mono">{user.name}</span>
                    </p>
                    <Link to="/updateProfile" className="hover:text-green underline">
                        Update Profile
                    </Link>
                    <div
                        className="w-28 h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
                    >
                        <button className="px-5 py-2" onClick={logOut}>Log out</button>
                    </div>
                </section>
            ) : (
                <div className='md:flex hidden gap-4 items-center'>
                    <div
                        className="w-28 h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
                    >
                        <button className="px-5 py-2" onClick={() => navigate('/login')}>Login</button>
                    </div>
                    <div
                        className="w-28 h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
                    >
                        <button className="px-5 py-2" onClick={() => navigate('/verifyOTP')}>Register</button>
                    </div>
                </div>
            )}


            <FiMenu
                onClick={() => setMenu(true)}
                className="text-3xl cursor-pointer md:hidden"
            />

            <div
                className={`fixed h-full w-screen z-40 lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 transition-all ${isMenu ? "-translate-y-0" : "-translate-y-full"
                    }`}
            >
                <section className="bg-white h-auto flex-col p-8 gap-4 z-50 flex w-full">
                    <IoCloseOutline
                        onClick={() => setMenu(false)}
                        className="text-3xl mt-0 mb-4 cursor-pointer absolute right-2 top-2 text-black"
                    />
                    <div
                        className="w-28 h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
                    >
                        <button
                            className="px-5 py-2"
                            onClick={() => {
                                navigate('/login');
                                setMenu(false);
                            }}>
                            Login
                        </button>
                    </div>
                    <div
                        className="w-28 h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
                    >
                        <button
                            className="px-5 py-2"
                            onClick={() => {
                                navigate('/verifyOTP');
                                setMenu(false);
                            }}>
                            Register
                        </button>
                    </div>
                </section>
            </div>
        </div >
    );
};

export default Navbar;