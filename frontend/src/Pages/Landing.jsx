import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className='w-full'>
      <section className='bg-hero bg-no-repeat bg-cover bg-center w-full opacity-[3] overflow-hidden min-h-svh flex flex-col justify-center items-center text-center p-6'>
        <h1 className='text-5xl font-extrabold text-white mb-4 z-20'>
          Let's Collab for work
        </h1>
        <p className='text-xl text-white mb-6 max-w-3xl z-20'>
          Welcome to CollabHub, the ultimate team collaboration platform designed for seamless project management. Whether you're a team lead organizing tasks or a team member tracking progress, CollabHub empowers you to streamline workflows, manage tasks efficiently, and monitor time logs—all in one workspace.
        </p>

      </section>
    </div>
  )
}


export default Landing;