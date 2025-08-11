"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AllApplications from "@/app/components/AllApplications";
import Header from "../components/ManagerHeader";
import StatCard from "@/app/components/StatCard";
import TeamPerformance from "@/app/components/TeamPerformance";
import Footer from "@/app/components/Footer";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function DashboardPage() {
    // Mock data for testing display
    const [applications, setApplications] = useState<any[]>([
        {
            id: "8a610aca-a223-43a1-9c56-d9803a5e7999",
            applicant_name: "Abebe Kebede",
            status: "in_progress",
            assigned_reviewer_name: "Abebeche Kebede",
            submitted_at: "2025-07-25T23:14:36.257313+03:00"
        },
        {
            id: "382db91c-270b-493f-902f-5f33694a4c2f",
            applicant_name: "Full Name",
            status: "pending_review",
            assigned_reviewer_name: null,
            submitted_at: "2025-07-29T16:15:07.600010+03:00"
        },
        {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            applicant_name: "Sarah Johnson",
            status: "accepted",
            assigned_reviewer_name: "John Doe",
            submitted_at: "2025-07-20T10:30:00.000000+03:00"
        },
        {
            id: "b2c3d4e5-f6a7-8901-2345-678901bcdef",
            applicant_name: "Michael Chen",
            status: "rejected",
            assigned_reviewer_name: "Jane Smith",
            submitted_at: "2025-07-18T14:45:00.000000+03:00"
        },
        {
            id: "c3d4e5f6-a7b8-9012-3456-789012cdefa",
            applicant_name: "Emily Rodriguez",
            status: "in_progress",
            assigned_reviewer_name: "Mike Wilson",
            submitted_at: "2025-07-22T09:15:00.000000+03:00"
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Mock reviewers data
    const reviewers = [
        {
            id: "223277f0-af11-44c5-843e-23afcb194ea8",
            name: "John Doe",
            email: "john@example.com",
            full_name: "John Doe"
        },
        {
            id: "334388g1-bg22-55c6-9544-34bgdc205fb9",
            name: "Jane Smith",
            email: "jane@example.com",
            full_name: "Jane Smith"
        },
        {
            id: "445499h2-ch33-66d7-1655-45ched306gc0",
            name: "Mike Wilson",
            email: "mike@example.com",
            full_name: "Mike Wilson"
        },
        {
            id: "5566aa3-di44-77e8-2766-56dfe407hd1",
            name: "Abebeche Kebede",
            email: "abebeche@example.com",
            full_name: "Abebeche Kebede"
        }
    ];

    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if not authenticated or not a manager
    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/auth/signin");
            return;
        }

        if ((session.user as any)?.role !== "manager") {
            router.push("/unauthorized");
            return;
        }
    }, [session, status, router]);

    // Mock assign reviewer function
    const handleAssignReviewer = async (
        applicationId: string,
        reviewerId: string
    ) => {
        try {
            // Find the reviewer
            const reviewer = reviewers.find(r => r.id === reviewerId);
            const reviewerName = reviewer ? reviewer.full_name || reviewer.name : "Unknown";

            // Update the application with the assigned reviewer
            setApplications(prev => prev.map(app =>
                app.id === applicationId
                    ? { ...app, assigned_reviewer_name: reviewerName }
                    : app
            ));

            setSuccessMessage(`Reviewer ${reviewerName} assigned successfully!`);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);

            return { success: true };
        } catch (err) {
            console.error("Failed to assign reviewer:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        }
    };

    const isLoading = loading || status === "loading";

    // Loading state
    if (status === "loading" || !session) {
        return (
            <>
                <Header />
                <main className="flex-1 mt-[42px] bg-gray-50 overflow-hidden">
                    <div className="pt-10 px-[100px] overflow-x-hidden">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-lg">Loading...</div>
                        </div>
                    </div>
                </main>
                <div className="w-full">
                    <Footer />
                </div>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <Header />
                <main className="flex-1 mt-[42px] bg-gray-50 overflow-hidden">
                    <div className="pt-10 px-[100px] overflow-x-hidden">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-lg text-red-600">Error: {error}</div>
                        </div>
                    </div>
                </main>
                <div className="w-full">
                    <Footer />
                </div>
            </>
        );
    }

    // Main content state
    return (
        <>
            <Header />

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4 mr-4">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                </div>
            )}

            <main className="flex-1 mt-[42px] bg-gray-50 overflow-hidden">
                <div className="pt-10 px-[100px] overflow-x-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <StatCard title="Total Applications" count={applications.length || 0} />
                        <StatCard title="Under Review" count={applications.filter((app: any) => app.status === "pending_review").length || 0} />
                        <StatCard title="In Progress" count={applications.filter((app: any) => app.status === "in_progress").length || 0} />
                        <StatCard title="Accepted" count={applications.filter((app: any) => app.status === "accepted").length || 0} />
                    </div>

                    <div className="space-y-8 pb-20">
                        <AllApplications
                            applications={applications}
                            reviewers={reviewers}
                            onAssignReviewer={handleAssignReviewer}
                        />
                        <TeamPerformance teamMembers={reviewers} applications={applications} />
                    </div>
                </div>
            </main>

            <div className="w-full">
                <Footer />
            </div>
        </>
    );
}
