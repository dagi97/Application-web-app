import React from 'react'
import DropDown from './DropDown';
const Row = ({ applicant, submitted, assignedReviewer, status, reviewers }: any) => {
    return (
        <tr className='text-left'>
            <td className='font-medium text-left'>{applicant}</td>
            <td className='text-[#6B7280] text-left'>{submitted}</td>
            <td>
                {/* <button className='text-[#6B7280] bg-[#EFEFEF] pr-10 pl-1 rounded-lg
                font-normal
                '>{assignedReviewer}</button> */}
                <button className='text-[#6B7280] bg-[#EFEFEF] pr-10 pl-1 rounded-lg
                font-normal
                '>{assignedReviewer}</button>

            </td>
            <td>
                {status === "Under Review"
                    ? <button className='text-[#854D0E] bg-[#FEF9C3] px-1 rounded-lg
                font-semibold
                '>{status}</button>
                    : status === "New"
                        ? <button className='text-[#1E40AF] bg-[#DBEAFE] px-1 rounded-lg
                font-semibold
                '>{status}</button>
                        :
                        <button className='text-[#1E40AF] bg-[#DBEAFE] px-1 rounded-lg
                font-semibold
                '>{status}</button>
                }

            </td>
            <td className="flex flex-col items-center"><DropDown reviewers={reviewers} /></td>
        </tr >
    );
}

const AllApplications = ({ reviewers }: any) => {
    return (
        <div className='p-10'>
            <table className="/table-fixed table-auto text-left py-4 px-8">
                <thead>
                    <tr>
                        <th className=''>APPLICANT</th>
                        <th className=''>SUBMITTED</th>
                        <th>ASSIGNED REVIEWER</th>
                        <th>STATUS</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="text-left py-4 px-8">
                    {reviewers.map(reviewer, index)=>
                    <Row
                        applicant={"Abel Tadesse"}
                        submitted={"Oct 26, 2023"}
                        assignedReviewer={"Jane R."}
                        status={"Under Review"}
                        reviewers={reviewers}
                    />    
                    }
                    <Row
                        applicant={"Abel Tadesse"}
                        submitted={"Oct 26, 2023"}
                        assignedReviewer={"Jane R."}
                        status={"Under Review"}
                    />
                    <Row
                        applicant={"Abel Tadesse"}
                        submitted={"Oct 26, 2023"}
                        assignedReviewer={"Jane R."}
                        status={"New"}
                    />
                </tbody>
            </table>
        </div>
    )
}

export default AllApplications