import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../api/axios';
import { Send, Eye } from 'lucide-react';
import { format } from 'date-fns';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyStatus, setReplyStatus] = useState({ loading: false, error: null, success: null });

    const fetchMessages = useCallback(() => {
        setLoading(true);
        axios.get('/api/messages')
            .then(res => {
                setMessages(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch messages.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);
    
    const openModal = (message) => {
        setSelectedMessage(message);
        setReplyText('');
        setReplyStatus({}); // Reset reply status
        if (message.status === 'new') {
            // Mark as read
            axios.put(`/api/messages/${message.id}/status`, { status: 'read' })
                .then(() => fetchMessages()); // Refresh list to show status change
        }
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        setReplyStatus({ loading: true, error: null, success: null });

        axios.post(`/api/messages/${selectedMessage.id}/reply`, { replyText })
            .then(() => {
                setReplyStatus({ loading: false, success: 'Reply sent successfully!', error: null });
                setReplyText('');
                setTimeout(() => {
                    setSelectedMessage(null); // Close modal on success
                    fetchMessages(); // Refresh list
                }, 1500);
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || 'Failed to send reply.';
                setReplyStatus({ loading: false, success: null, error: errorMsg });
            });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-500';
            case 'read': return 'bg-gray-500';
            case 'replied': return 'bg-green-500';
            default: return 'bg-gray-400';
        }
    };

    if (loading) return <div className="text-center p-8">Loading messages...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Messages</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {messages.map(msg => (
                        <li key={msg.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <span className={`mr-4 p-1.5 text-xs font-bold text-white ${getStatusBadge(msg.status)} rounded-full`}>{msg.status.toUpperCase()}</span>
                                <div>
                                    <p className="font-semibold text-gray-800">{msg.sender_name} <span className="text-sm text-gray-500 font-normal">&lt;{msg.sender_email}&gt;</span></p>
                                    <p className="text-sm text-gray-600 truncate max-w-md">{msg.message}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-6">{format(new Date(msg.created_at), 'MMM d, yyyy')}</span>
                                <button onClick={() => openModal(msg)} className="text-indigo-600 hover:text-indigo-800 p-2"><Eye size={20} /></button>
                                {/* <button className="text-red-500 hover:text-red-700 p-2"><Trash2 size={20} /></button> */}
                            </div>
                        </li>
                    ))}
                </ul>
                {messages.length === 0 && <p className="p-8 text-center text-gray-500">No messages found.</p>}
            </div>

            {/* Message Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Message from {selectedMessage.sender_name}</h2>
                            <p className="text-sm text-gray-500">{selectedMessage.sender_email}</p>
                            <p className="text-sm text-gray-500 mt-1">{format(new Date(selectedMessage.created_at), 'PPP p')}</p>
                        </div>
                        
                        <div className="p-6 max-h-60 overflow-y-auto bg-gray-50">
                            <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Reply</h3>
                            <form onSubmit={handleReplySubmit}>
                                <textarea 
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    rows="5"
                                    placeholder={`Type your reply to ${selectedMessage.sender_name}...`}
                                    required
                                />
                                <div className="mt-4 flex justify-between items-center">
                                    <div>
                                        {replyStatus.success && <p className="text-green-600">{replyStatus.success}</p>}
                                        {replyStatus.error && <p className="text-red-600">{replyStatus.error}</p>}
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setSelectedMessage(null)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={replyStatus.loading} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                                            {replyStatus.loading ? 'Sending...' : 'Send Reply'}
                                            {!replyStatus.loading && <Send size={16} className="ml-2" />}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMessages;