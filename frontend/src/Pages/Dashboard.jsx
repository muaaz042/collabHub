import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkspaceCard from '../Components/WorkspaceCard';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [user, setUser] = useState(null);

  const [data, setData] = useState({
    name: "",
    teamLeadEmail: "",
    error: null,
  });

  const { name, teamLeadEmail, error } = data;

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

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/allWork', {
          headers: { Authorization: `colllabHub ${token}` },
        });

        if (Array.isArray(response.data)) {
          setWorkspaces(response.data);
        } else {
          console.error('Workspaces data is not an array:', response.data);
          setWorkspaces([]);
        }
      } catch (error) {
        console.error('Failed to fetch workspaces:', error.response?.data || error.message);
      }
    };

    fetchWorkspaces();
  }, [navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleAddWorkspace = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/workspace/create',
        { name, teamLeadEmail },
        { headers: { Authorization: `collabHub ${token}` } }
      );
      setWorkspaces([...workspaces, response.data]);
      setData({ ...data, name: "", teamLeadEmail: "" });
    } catch (error) {
      setData({ ...data, error: error.response?.data?.error });
      console.error('Failed to create workspace:', error.response?.data || error.message);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/workspace/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkspaces(workspaces.filter(workspace => workspace._id !== workspaceId));
    } catch (error) {
      console.error('Failed to delete workspace:', error.response?.data || error.message);
    }
  };

  return (
    <div className='w-full flex flex-col'>
      {error ? <p className="text-red-500 lg:px-48 md:px-32 sm:px-20">{error}</p> : null}
      <div className='flex lg:px-48 md:px-32 sm:px-20 px-5 py-16 justify-between gap-5'>

        <input
          className="text-sm custom-input w-full px-4 py-2 border border-green rounded-lg shadow-sm bg-gray-100"
          placeholder="Enter workspace title"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <input
          className="text-sm custom-input w-full px-4 py-2 border border-green rounded-lg shadow-sm bg-gray-100"
          placeholder="Enter team lead email"
          type="email"
          name="teamLeadEmail"
          value={teamLeadEmail}
          onChange={handleChange}
        />
        <div
          className="w-full h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
          onClick={handleAddWorkspace}
        >
          <button className="px-5 py-2">Add Workspace</button>
        </div>
      </div>

      <div className='w-full lg:px-48 md:px-32 sm:px-20 px-5 py-16 flex flex-col gap-20'>
        {Array.isArray(workspaces) && workspaces.map(workspace => (
          <div key={workspace._id}>
            <WorkspaceCard workspace={workspace} />
            <div
              className="w-full h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-red-500 shadow-lg hover:bg-red-500 text-red-500 hover:text-white duration-300 cursor-pointer active:scale-[0.98]"
              onClick={() => handleDeleteWorkspace(workspace._id)}
            >
              <button className="px-5 py-2">Delete Workspace</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
