'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  useGetCyclesQuery,
  useActivateCycleMutation,
  useDeactivateCycleMutation,
  useDeleteCycleMutation 
} from '../../../lib/redux/api/adminApi';


type Cycle = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
};

type Pagination = {
  page: number;
  limit: number;
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ErrorDisplay = ({ error }: { error: any }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Error:</strong> {error?.message || 'Failed to load cycles'}
    </div>
  </div>
);

const SuccessAlert = ({ message }: { message: string }) => (
  <div className="fixed top-4 right-4 z-50">
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      {message}
    </div>
  </div>
);

const ErrorAlert = ({ message }: { message: string }) => (
  <div className="fixed top-4 right-4 z-50">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {message}
    </div>
  </div>
);

const CycleCard = ({
  cycle,
  onActivate,
  onDeactivate,
  onDelete,
  isActivating,
  isDeactivating,
  isDeleting,
  deleteError
}: {
  cycle: Cycle;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete:(id:string)=>void;
  isActivating: boolean;
  isDeactivating: boolean;
  isDeleting: boolean;
  deleteError?: string | null;
}) => {
  const generationMatch = cycle.name.match(/G(\d+)/);
  const generationNumber = generationMatch ? parseInt(generationMatch[1]) : 0;
  const ordinal = [
    'first', 'second', 'third', 'fourth', 'fifth', 
    'sixth', 'seventh', 'eighth', 'ninth', 'tenth'
  ][generationNumber - 1] || '';

  // Randomly select a country
  const countries = ['Ethiopia', 'Kenya', 'Nigeria', 'Ghana'];
  const country = countries[Math.floor(Math.random() * countries.length)];

  return (
    <div>
      <div className="relative w-full bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        {deleteError && (
          <div className="mb-2 p-2 text-sm text-red-600 bg-red-50 rounded">
            {deleteError}
          </div>
        )}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {cycle.name}
          </h3>
          <div className="flex space-x-2">
            {cycle.is_active ? (
              <button
                className="px-3 py-1 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                onClick={() => onDeactivate(cycle.id)}
                disabled={isDeactivating}
              >
                {isDeactivating ? 'Deactivating...' : 'close'}
              </button>
            ) : (
              <button
                className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                onClick={() => onActivate(cycle.id)}
                disabled={isActivating}
              >
                {isActivating ? 'Activating...' : 'Activate'}
              </button>
            )}
            <Link
              className="px-3 py-1 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600"
              href={`/admin/cycle/${cycle.id}`}
            >
              Edit
            </Link>
            <button
              className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50"
              onClick={() => onDelete(cycle.id)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          {ordinal ? `The ${ordinal} generation of A2SVians` : cycle.name}
        </p>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          {/* Country replaces status */}
          <div className="text-sm text-gray-500">
            Country: <span className="font-semibold">{country}</span>
          </div>
          {/* Status replaces date */}
          <div className="text-sm">
            Status: <span className={cycle.is_active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {cycle.is_active ? 'Active' : 'Closed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PaginatedCycles() {
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 4 });
  const [currentDeletingId, setCurrentDeletingId] = useState<string | null>(null);
  const [currentActingId, setCurrentActingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const router = useRouter();
  
  const { 
    data: cyclesData, 
    isLoading, 
    error: fetchError,
    isFetching,
    refetch
  } = useGetCyclesQuery(pagination);
  
  const [activateCycle, { isLoading: isActivating }] = useActivateCycleMutation();
  const [deactivateCycle, { isLoading: isDeactivating }] = useDeactivateCycleMutation();
  const [deleteCycle, { isLoading: isDeleting, error: deleteErrorRaw }] = useDeleteCycleMutation();

  const deleteError = deleteErrorRaw 
    ? (deleteErrorRaw as any).data?.message || 'Failed to delete cycle'
    : null;

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleActivate = async (cycleId: string) => {
    try {
      setCurrentActingId(cycleId);
      await activateCycle(cycleId).unwrap();
      showAlert('success', 'Cycle activated successfully');
      refetch();
    } catch (error: any) {
      showAlert('error', error.data?.message || 'Failed to activate cycle');
    } finally {
      setCurrentActingId(null);
    }
  };

  const handleDeactivate = async (cycleId: string) => {
    try {
      setCurrentActingId(cycleId);
      await deactivateCycle(cycleId).unwrap();
      showAlert('success', 'Cycle deactivated successfully');
      refetch();
    } catch (error: any) {
      showAlert('error', error.data?.message || 'Failed to deactivate cycle');
    } finally {
      setCurrentActingId(null);
    }
  };

  const handleDelete = async (cycleId: string) => {
    if (window.confirm('Are you sure you want to delete this cycle? This action cannot be undone.')) {
      setCurrentDeletingId(cycleId);
      try {
        const result = await deleteCycle(cycleId).unwrap();
        if (result.success) {
          showAlert('success', 'Cycle deleted successfully');
          refetch();
        } else {
          showAlert('error', result.message || 'Failed to delete cycle');
        }
      } catch (error: any) {
        showAlert('error', error.data?.message || 'Failed to delete cycle');
      } finally {
        setCurrentDeletingId(null);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (fetchError) return <ErrorDisplay error={fetchError} />;

  const { cycles = [], total_count = 0 } = cyclesData?.data || {};
  const totalPages = Math.ceil(total_count / pagination.limit);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {alert && (alert.type === 'success' 
        ? <SuccessAlert message={alert.message} /> 
        : <ErrorAlert message={alert.message} />
      )}

      <div className="flex flex-col items-start px-4 py-10 gap-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="font-bold text-3xl text-gray-900">
            Application Cycles
          </h1>
          <Link 
            href="/admin/cycle/create"
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors"
          >
            Create New Cycle
          </Link>
        </div>

        <div className="flex flex-col items-center w-full py-10 gap-10">
          <div className="flex flex-col items-start w-full gap-8">
            {cycles.length === 0 ? (
              <div className="w-full text-center py-10">
                <p className="text-gray-500">No cycles found</p>
                <Link 
                  href="/admin/cycle/create"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create New Cycle
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {cycles.map((cycle) => (
                    <CycleCard
                      key={cycle.id}
                      cycle={cycle}
                      onActivate={handleActivate}
                      onDeactivate={handleDeactivate}
                      onDelete={handleDelete}
                      isActivating={isActivating && currentActingId === cycle.id}
                      isDeactivating={isDeactivating && currentActingId === cycle.id}
                      isDeleting={isDeleting && currentDeletingId === cycle.id}
                      deleteError={currentDeletingId === cycle.id ? deleteError : null}
                    />
                  ))}
                </div>

              
                  <div className="w-full mt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                      <p className="text-sm text-gray-700">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, total_count)} of {total_count} results
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="p-2 w-10 h-10 bg-white border border-gray-300 rounded-l-md disabled:opacity-50 hover:bg-gray-50"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 h-10 font-medium text-sm ${
                                pagination.page === pageNum
                                  ? 'bg-indigo-50 border border-indigo-500 text-indigo-600'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === totalPages}
                          className="p-2 w-10 h-10 bg-white border border-gray-300 rounded-r-md disabled:opacity-50 hover:bg-gray-50"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
