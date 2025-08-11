"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AllApplications from "@/app/components/AllApplications";
import HeaderManagerDetail from "@/app/components/HeaderManagerDetail";
import StatCard from "@/app/components/StatCard";
import TeamPerformance from "./TeamPerformance";
import Footer from "@/app/components/Footer";
import {
    useAssignReviewerMutation,
    useDecideApplicationMutation,
    useGetAllReviewersQuery
} from "@/lib/redux/api/managerApi";

export default function DashboardPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: session, status } = useSession();
    const router = useRouter();

    // Use Redux API hooks
    const [assignReviewer] = useAssignReviewerMutation();
    const [decideApplication] = useDecideApplicationMutation();
    const { data: reviewersData, isLoading: reviewersLoading } = useGetAllReviewersQuery();

    // Redirect if not authenticated or not a manager
    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/auth/signin");
            return;
        }

        if (session.user?.role !== "manager") {
            router.push("/unauthorized");
            return;
        }
    }, [session, status, router]);

    // GET /manager/applications/ - List Applications with full details
    const fetchApplications = async () => {
        try {
            const response = await fetch("https://a2sv-application-platform-backend-team2.onrender.com/manager/applications/", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success && data.data) {
                const basicApplications = data.data.applications || [];

                // Fetch full details for each application to get submitted_at
                const applicationsWithDetails = await Promise.all(
                    basicApplications.map(async (app: any) => {
                        try {
                            const detailResponse = await fetch(`https://a2sv-application-platform-backend.onrender.com/applications/${app.id}`, {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${session?.access}`,
                                },
                            });

                            if (detailResponse.ok) {
                                const detailData = await detailResponse.json();
                                if (detailData.success && detailData.data) {
                                    // Merge the basic app data with the detailed data
                                    return {
                                        ...app,
                                        ...detailData.data
                                    };
                                }
                            }
                        } catch (err) {
                            console.error(`Failed to fetch details for application ${app.id}:`, err);
                        }
                        // Return basic app data if detail fetch fails
                        return app;
                    })
                );

                setApplications(applicationsWithDetails);
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    // PATCH /manager/applications/{application_id}/assign/ - Assign Reviewer
    const handleAssignReviewer = async (applicationId: string, reviewerId: string) => {
        try {
            await assignReviewer({ appId: applicationId, reviewer_id: reviewerId }).unwrap();
            setSuccessMessage("Reviewer assigned successfully!");

            // Refresh applications to show updated assignment
            await fetchApplications();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);

            return { success: true };
        } catch (err) {
            console.error("Failed to assign reviewer:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        }
    };

    // PATCH /manager/applications/{application_id}/decide/ - Decide Application
    const handleDecideApplication = async (applicationId: string, status: string, decisionNotes: string) => {
        try {
            await decideApplication({
                appId: applicationId,
                status: status as "accepted" | "rejected",
                decision_notes: decisionNotes
            }).unwrap();

            setSuccessMessage(`Application ${status} successfully!`);

            // Refresh applications to show updated status
            await fetchApplications();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);

            return { success: true };
        } catch (err) {
            console.error("Failed to make decision:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        }
    };


    useEffect(() => {
        if (session && session.access) {
            const loadData = async () => {
                setLoading(true);
                try {
                    await fetchApplications();
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Unknown error");
                } finally {
                    setLoading(false);
                }
            };

            loadData();
        }
    }, [session]);

    const isLoading = loading || reviewersLoading || status === "loading";

    if (status === "loading" || !session) {
        return (
            <div className="flex flex-col min-h-screen">
                <HeaderManagerDetail managerName={session?.user?.name || "Manager"} />
                <main className="flex-1 ml-[159px] mt-[42px] bg-gray-50 w-full overflow-auto pt-10 px-[100px]">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Loading...</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <HeaderManagerDetail managerName={session?.user?.name || "Manager"} />
                <main className="flex-1 ml-[159px] mt-[42px] bg-gray-50 w-full overflow-auto pt-10 px-[100px]">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-red-600">Error: {error}</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const reviewers = reviewersData?.data?.reviewers || [];

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderManagerDetail managerName={session?.user?.name || "Manager"} />

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative ml-[159px] mt-4 mr-4">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                </div>
            )}

            <main className="flex-1 ml-[159px] mt-[42px] bg-gray-50 w-full overflow-auto pt-10 px-[100px]">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <StatCard title="Total Applications" count={applications.length || 0} />
                    <StatCard title="Under Review" count={applications.filter((app: any) => app.status === "pending_review").length || 0} />
                    <StatCard title="In Progress" count={applications.filter((app: any) => app.status === "in_progress").length || 0} />
                    <StatCard title="Accepted" count={applications.filter((app: any) => app.status === "accepted").length || 0} />
                </div>

                <div className="space-y-8">
                    <AllApplications
                        applications={applications}
                        reviewers={reviewers}
                        onAssignReviewer={handleAssignReviewer}
                    />
                    <TeamPerformance teamMembers={reviewers} applications={applications} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
