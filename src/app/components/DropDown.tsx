"use client";
import { useState } from 'react';

const Actions = () => {
    return (
        <div className='flex gap-2 items-center justify-center'>
            <p className='text-[#4F46E5]'>Actions</p>
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.234229 0.834563C0.384251 0.684586 0.587698 0.600333 0.799829 0.600333C1.01196 0.600333 1.21541 0.684586 1.36543 0.834563L3.99983 3.46896L6.63423 0.834563C6.70803 0.758155 6.7963 0.697209 6.89391 0.655282C6.99151 0.613354 7.09649 0.591285 7.20271 0.590362C7.30893 0.589439 7.41428 0.60968 7.51259 0.649905C7.61091 0.69013 7.70023 0.749532 7.77534 0.824646C7.85046 0.899761 7.90986 0.989082 7.95009 1.0874C7.99031 1.18572 8.01055 1.29106 8.00963 1.39728C8.00871 1.50351 7.98664 1.60848 7.94471 1.70609C7.90278 1.80369 7.84184 1.89197 7.76543 1.96576L4.56543 5.16576C4.41541 5.31574 4.21196 5.39999 3.99983 5.39999C3.7877 5.39999 3.58425 5.31574 3.43423 5.16576L0.234229 1.96576C0.0842524 1.81574 0 1.61229 0 1.40016C0 1.18803 0.0842524 0.984585 0.234229 0.834563Z" fill="#4F46E5" />
            </svg>
        </div>
    )
}

export default function DropDown({ reviewers, appId, onAssignReviewer, currentStatus, currentReviewer }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleAssignReviewer = async (reviewerId: string) => {
        try {
            await onAssignReviewer(appId, reviewerId);
            setIsAssignOpen(false);
            setIsOpen(false);
        } catch (error) {
            console.error('Assignment failed:', error);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Actions />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]">
                    <div className="py-1">
                        <a
                            href={`/manager/detail/${appId}`}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => setIsOpen(false)}
                        >
                            View Details
                        </a>

                        <div className="relative">
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex justify-between items-center"
                                onClick={() => setIsAssignOpen(!isAssignOpen)}
                            >
                                <span>Assign Reviewer</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {isAssignOpen && (
                                <div className="absolute left-full top-0 ml-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[10000]">
                                    <div className="py-1">
                                        <div className="px-3 py-2">
                                            <input
                                                type="text"
                                                placeholder="Search reviewers..."
                                                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto border-t border-gray-200">
                                            {reviewers && reviewers.length > 0 ? (
                                                reviewers
                                                    .filter((reviewer: any) =>
                                                        (reviewer.full_name || reviewer.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (reviewer.email || "").toLowerCase().includes(searchTerm.toLowerCase())
                                                    )
                                                    .map((reviewer: any) => (
                                                        <button
                                                            key={reviewer.id}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                                                            onClick={() => handleAssignReviewer(reviewer.id)}
                                                        >
                                                            <img src="/ProfileIcon.svg" alt="Profile" className="w-4 h-4" />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{reviewer.full_name || reviewer.name}</span>
                                                                <span className="text-xs text-gray-500">{reviewer.email}</span>
                                                            </div>
                                                        </button>
                                                    ))
                                            ) : (
                                                <div className="px-4 py-2 text-sm text-gray-500">
                                                    No reviewers available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
