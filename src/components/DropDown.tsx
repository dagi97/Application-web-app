import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
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


export const DropDown2 = ({ reviewers }: any) => {
    return (
        <div className="dropdown">
            <ul tabIndex={0} className="menu bg-base-200 rounded-box dropdown-content z-[1] inline-block ">
                <details className="[&>summary::-webkit-details-marker]:hidden [&>summary::marker]:hidden">
                    <summary className="flex items-center gap-2"><Actions /></summary>
                    <ul className='bg-white py-3 rounded-lg'>
                        <li>
                            <a>Review</a>
                        </li>
                        <li>
                            <a>View Details</a>
                        </li>
                        <li>
                            <details className="dropdown dropdown-right flex items-start [&>summary::-webkit-details-marker]:hidden [&>summary::marker]:hidden">
                                <summary className="btn btn-ghost btn-sm inline-flex items-center gap-4">
                                    <p className='min-w-[150px]'>Assign to Reviewer</p>
                                    <img src="/DropDownIcon.svg" alt="Dropdown Icon" className="w-4 h-4 mt-1" />
                                </summary>
                                <ul className="menu bg-base-200 w-56 rounded-box dropdown-content z-[1] pl-5">
                                    <li key={crypto.randomUUID()} className="flex items-center gap-2">

                                        <span
                                            className="font-inter font-medium text-[14px] leading-[20px] align-bottom"
                                            style={{ letterSpacing: '0.01em', color: '#374151' }}
                                        >
                                            Search for a reviewer
                                        </span>
                                    </li>
                                    {reviewers.map((reviewer, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <img src="/ProfileIcon.svg" alt="Profile Icon" className="w-[16px] h-[16px]" />
                                            <span
                                                className="font-inter font-medium text-[14px] leading-[20px] align-bottom"
                                                style={{ letterSpacing: '0.01em', color: '#374151' }}
                                            >
                                                {reviewer.full_name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </li>
                    </ul>
                </details>

            </ul></div>
    );
}

export default function DropDown({ reviewers }: any) {
    return (
        <DropDown2 reviewers={reviewers} />
    );
}