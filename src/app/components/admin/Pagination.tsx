'use client';

import React from 'react';

const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, totalResults, limit, onPageChange }: PaginationProps) => {
    const pageNumbers = generatePageNumbers(currentPage, totalPages);
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalResults);
    
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col items-center gap-4 py-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalResults}</span> results
            </p>

            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                    &lt;
                </button>
                
                {pageNumbers.map((page, index) => {
                    if (typeof page === 'string') {
                        return <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">...</span>;
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                currentPage === page
                                    ? 'bg-indigo-600 text-white focus:z-20'
                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                    &gt;
                </button>
            </nav>
        </div>
    );
};

export default Pagination;