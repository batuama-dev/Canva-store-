import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../api/axios';
import { Send, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyStatus, setReplyStatus] = useState({ loading: false, error: null, success: null });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMessages = useCallback((page = 1) => {
        setLoading(true);
        axios.get(`/api/messages?page=${page}&limit=10`)
            .then(res => {
                setMessages(res.data.messages);
                setCurrentPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch messages.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchMessages(currentPage);
    }, [fetchMessages, currentPage]);
    
    const openModal = (message) => {
        setSelectedMessage(message);
        setReplyText('');
        setReplyStatus({}); // Reset reply status
        if (message.status === 'new') {
            // Mark as read
            axios.put(`/api/messages/${message.id}/status`, { status: 'read' })
                .then(() => fetchMessages(currentPage)); // Refresh list to show status change
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
                    fetchMessages(currentPage); // Refresh list
                }, 1500);
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || 'Failed to send reply.';
                setReplyStatus({ loading: false, success: null, error: errorMsg });
            });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-500';
            case 'read': return 'bg-gray-500';
            case 'replied': return 'bg-green-500';
            default: return 'bg-gray-400';
        }
    };

    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    // The initial load is handled by the opacity on the container.
    // We only need a full-page message if there's an error.

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gérer les messages</h1>

            <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <ul className="divide-y divide-gray-200">
                    {messages.map(msg => (
                        <li key={msg.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <span className={`mr-3 p-1.5 text-xs font-bold text-white ${getStatusBadge(msg.status)} rounded-full`}>{msg.status.toUpperCase()}</span>
                                    <p className="font-semibold text-gray-800">{msg.sender_name} <span className="text-sm text-gray-500 font-normal hidden sm:inline">&lt;{msg.sender_email}&gt;</span></p>
                                </div>
                                <p className="text-sm text-gray-500 font-normal sm:hidden mb-2">{msg.sender_email}</p>
                                <p className="text-sm text-gray-600 truncate max-w-xs sm:max-w-md md:max-w-lg">{msg.message}</p>
                            </div>
                            <div className="flex items-center self-end sm:self-center">
                                <span className="text-sm text-gray-500 mr-4">{format(new Date(msg.created_at), 'd MMM yyyy', { locale: fr })}</span>
                                <button onClick={() => openModal(msg)} className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100"><Eye size={20} /></button>
                            </div>
                        </li>
                    ))}
                </ul>
                
                {messages.length === 0 && !loading && <p className="p-8 text-center text-gray-500">Aucun message pour le moment.</p>}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="p-4 flex flex-col sm:flex-row justify-center items-center mt-8 gap-2">
                    <div className="flex">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || loading}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Précédent
                        </button>
                        <span className="px-4 py-1 bg-white border-t border-b border-gray-300 text-sm text-gray-700 hidden sm:block">
                            Page {currentPage} sur {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || loading}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            Suivant
                            <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                     <span className="text-sm text-gray-700 sm:hidden">
                        Page {currentPage} sur {totalPages}
                    </span>
                </div>
            )}


            {/* Message Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Message de {selectedMessage.sender_name}</h2>
                            <p className="text-sm text-gray-500">{selectedMessage.sender_email}</p>
                            <p className="text-sm text-gray-500 mt-1">{format(new Date(selectedMessage.created_at), 'PPP p', { locale: fr })}</p>
                        </div>
                        
                        <div className="p-6 max-h-60 overflow-y-auto bg-gray-50">
                            <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Répondre</h3>
                            <form onSubmit={handleReplySubmit}>
                                <textarea 
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    rows="5"
                                    placeholder={`Écrire une réponse à ${selectedMessage.sender_name}...`}
                                    required
                                />
                                <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div className="self-center sm:self-auto">
                                        {replyStatus.success && <p className="text-green-600">{replyStatus.success}</p>}
                                        {replyStatus.error && <p className="text-red-600">{replyStatus.error}</p>}
                                    </div>
                                    <div className="flex flex-col-reverse sm:flex-row gap-4 w-full sm:w-auto">
                                        <button type="button" onClick={() => setSelectedMessage(null)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 w-full sm:w-auto">
                                            Annuler
                                        </button>
                                        <button type="submit" disabled={replyStatus.loading} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center w-full sm:w-auto">
                                            {replyStatus.loading ? 'Envoi...' : 'Envoyer'}
                                            {!replyStatus.loading && <Send size={16} className="ml-2" />}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageMessages;