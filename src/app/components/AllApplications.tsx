import React from 'react'
import DropDown from './DropDown';

const Row = ({ applicant, submitted, assignedReviewer, status, reviewers, appId, onAssignReviewer }: any) => {
    // Format the submitted date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid Date";
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Get status styling
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pending_review":
            case "Under Review":
                return 'text-[#854D0E] bg-[#FEF9C3]';
            case "in_progress":
            case "In Progress":
                return 'text-[#7C2D12] bg-[#FED7AA]';
            case "accepted":
            case "Accepted":
                return 'text-[#166534] bg-[#DCFCE7]';
            case "rejected":
            case "Rejected":
                return 'text-[#991B1B] bg-[#FEE2E2]';
            case "New":
                return 'text-[#1E40AF] bg-[#DBEAFE]';
            default:
                return 'text-[#6B7280] bg-[#F3F4F6]';
        }
    };

    // Format status text
    const formatStatus = (status: string) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <tr className='text-left border-b border-gray-200 hover:bg-gray-50'>
            <td className='font-medium text-left py-4 px-4'>{applicant}</td>
            <td className='text-[#6B7280] text-left py-4 px-4'>{formatDate(submitted)}</td>
            <td className='py-4 px-4'>
                <button className='text-[#6B7280] bg-[#EFEFEF] pr-4 pl-3 py-1 rounded-lg font-normal text-sm'>
                    {assignedReviewer || "Not Assigned"}
                </button>
            </td>
            <td className='py-4 px-4'>
                <button className={`${getStatusStyle(status)} px-3 py-1 rounded-lg font-semibold text-sm`}>
                    {formatStatus(status)}
                </button>
            </td>
            <td className='py-4 px-4'>
                <DropDown
                    reviewers={reviewers}
                    appId={appId}
                    onAssignReviewer={onAssignReviewer}
                    currentStatus={status}
                    currentReviewer={assignedReviewer}
                />
            </td>
        </tr>
    );
}

const AllApplications = ({ applications, reviewers, onAssignReviewer }: any) => {
    return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='px-6 py-4 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900'>All Applications</h2>
            </div>
            <div className='overflow-x-auto'>
                <table className="w-full text-left">
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>APPLICANT</th>
                            <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>SUBMITTED</th>
                            <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ASSIGNED REVIEWER</th>
                            <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>STATUS</th>
                            <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                        {Array.isArray(applications) && applications.length > 0 ? (
                            applications.map((application: any, index: number) => (
                                <Row
                                    key={application.id || index}
                                    applicant={application.applicant_name}
                                    submitted={application.submitted_at}
                                    assignedReviewer={application.assigned_reviewer_name || "Not Assigned"}
                                    status={application.status}
                                    reviewers={reviewers}
                                    appId={application.id}
                                    onAssignReviewer={onAssignReviewer}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-500'>
                                    No applications found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AllApplications
