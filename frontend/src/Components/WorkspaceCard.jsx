import React, { useState } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios';

const WorkspaceCard = ({ workspaceId }) => {
    const [memberEmail, setMemberEmail] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [members, setMembers] = useState([]); // Assuming members data comes from props or initial fetch
    const [tasks, setTasks] = useState([]);

    const handleAddMember = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/workspace/${workspaceId}/add-member`, { email: memberEmail });
            setMembers([...members, response.data.member]);  // Update members list
            setMemberEmail('');
        } catch (error) {
            console.error('Failed to add member:', error.response.data);
        }
    };

    const handleAddTask = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/task/create`, {
                title: taskTitle,
                deadline: deadline,
                assignedTo: memberEmail,
            });
            setTasks([...tasks, response.data.task]);
            setTaskTitle('');
            setDeadline('');
        } catch (error) {
            console.error('Failed to add task:', error.response.data);
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            await axios.delete(`/workspace/${workspaceId}/remove-member`, { data: { email: memberId } });
            setMembers(members.filter(member => member._id !== memberId)); // Remove from the state
        } catch (error) {
            console.error('Failed to remove member:', error.response.data);
        }
    };

    return (
        <div className='w-full overflow-hidden rounded-3xl border-4 border-green'>
            <div className='flex justify-start flex-col flex-wrap gap-5 w-full rounded-3xl bg-white px-3 md:px-5 py-5 text-black'>
                <div className='flex justify-between'>
                    <h1 className='lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-semibold'>Workspace title</h1>
                    <MdDeleteOutline className='text-2xl hover:scale-125 hover:text-green' />
                </div>
                <div><span className='text-black font-semibold'>Admin name: </span>Workspace admin</div>
                <div><span className='text-black font-semibold'>Team Lead name: </span>Workspace team lead</div>
                <p>Add team member below</p>
                <div className='flex justify-between gap-5'>
                    <input
                        className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                        placeholder="Enter member email"
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                    />
                    <input
                        className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                        placeholder="Enter task title"
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                    <input
                        className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                        placeholder="Enter deadline"
                        type="text"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                    <div
                        className="w-full h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-green shadow-lg hover:bg-green text-green hover:text-white duration-300 cursor-pointer active:scale-[0.98]"

                    >
                        <button className="px-5 py-2" onClick={handleAddMember}>Add Member</button>
                    </div>
                </div>
                <div class="relative overflow-x-auto  border-2 border-black shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left text-black">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3">Team Member Email</th>
                                <th scope="col" class="px-6 py-3">Task</th>
                                <th scope="col" class="px-6 py-3">Status</th>
                                <th scope="col" class="px-6 py-3">Deadline</th>
                                <th scope="col" class="px-6 py-3">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member._id} class="bg-white border-b">
                                    <td class="px-6 py-4 font-medium text-gray-900">{member.email}</td>
                                    <td class="px-6 py-4">{member.task}</td>
                                    <td class="px-6 py-4">{member.status || 'Pending'}</td>
                                    <td class="px-6 py-4">{member.deadline}</td>
                                    <td scope="col" class="px-6 py-3">
                                        <div
                                            className="w-full h-10 rounded-lg bg-transparent items-center justify-center flex border-2 border-red-500 shadow-lg hover:bg-red-500 text-red-500 hover:text-white duration-300 cursor-pointer"
                                            onClick={() => handleRemoveMember(member._id)}
                                        >
                                            <button className="px-5 py-2">delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default WorkspaceCard;
