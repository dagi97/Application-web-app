
import AllApplications from "@/app/components/AllApplications";
import Header from "@/components/Header";
import StatCard from "@/app/components/StatCard";
import DropDown from "@/app/components/DropDown";
import TeamPerformance from "@/app/components/TeamPerformance";

const viewApplications = {
    success: true,
    data: {
        applications: [
            {
                id: "7e070150-9c37-412c-b72a-15b7da78fa95",
                applicant_name: "TEST 1",
                status: "accepted",
                assigned_reviewer_name: "Joseph"
            },
            {
                id: "fdae63a5-f4b3-4855-958c-a3c78558692b",
                applicant_name: "debo",
                status: "accepted",
                assigned_reviewer_name: null
            },
            {
                id: "1e4e5a9b-34c8-454c-b633-3c50e798dd56",
                applicant_name: "Fikir Anteneh",
                status: "pending_review",
                assigned_reviewer_name: "Desalegn"
            },
            {
                id: "75191896-371e-4b97-8349-e25e63ef383a",
                applicant_name: "TEST 2",
                status: "pending_review",
                assigned_reviewer_name: "Joseph"
            },
            {
                id: "8db025c5-e0c9-40e3-843a-fc65713dc1dd",
                applicant_name: "TEST 3",
                status: "in_progress",
                assigned_reviewer_name: null
            }
        ],
        total_count: 5,
        page: 1,
        limit: 10
    },
    message: "Applications fetched successfully"
};

// const viewApplicationsById = 

const viewAvailableReviewers = {
    "success": true,
    "data": {
        "reviewers": [
            {
                "id": "7a7fb79b-9dbf-41d0-ac5c-eb5f165b471b",
                "full_name": "Joseph",
                "email": "abcd@gmail.com"
            },
            {
                "id": "68057fd7-3cb3-4c91-a5aa-8143ba0dd38f",
                "full_name": "Desalegn",
                "email": "desalegn@gmail.com"
            }
        ],
        "total_count": 2
    },
    "message": "Available reviewers fetched successfully."
}


export default function DashboardPage() {
    return (
        <div className="flex flex-col">
            <Header />
            <main className="
      /ml-[159px] 
      mt-[42px]  bg-gray-50 
      min-h-screen  px-[100px]
      w-full overflow-auto pt-10">
                <div className="
        flex flex-col md:flex-row items-center
        gap-6">
                    <StatCard title="Total Applications" count={1204} />
                    <StatCard title="Under Review" count={750} />
                    <StatCard title="Interview Stage" count={250} />
                    <StatCard title="Accepted" count={82} />
                </div>
                <div className=''>
                    <AllApplications applications={viewApplications.data.applications}
                        reviewers={viewAvailableReviewers.data.reviewers}
                    />
                    <TeamPerformance teamMembers={[
                        {}, {}
                    ]} />
                </div>
                {/* <DropDown /> */}

            </main>


        </div>
    );
}
