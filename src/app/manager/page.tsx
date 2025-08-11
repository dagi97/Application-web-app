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
import {
    useAssignReviewerMutation,
    useGetAllReviewersQuery,
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
    const { data: reviewersData, isLoading: reviewersLoading } = useGetAllReviewersQuery();

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

    // Helper to get access token from NextAuth session
    const getAccessToken = async () => {
        if (typeof window === "undefined") return null;

        // Try to get NextAuth session first
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        return session?.access || null;
    };

    // GET /manager/applications/ - List Applications
    const fetchApplications = async () => {
        try {
            const token = await getAccessToken();

            if (!token) {
                setError("No access token found. Please sign in again.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                "https://a2sv-application-platform-backend-team2.onrender.com/manager/applications/",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Manager API Response:", data);

            if (data.success && data.data) {
                const applicationsData = data.data.applications || [];
                console.log("Applications from manager API:", applicationsData);

                // For each application, get detailed information
                const applicationsWithDetails = await Promise.all(
                    applicationsData.map(async (app: any) => {
                        try {
                            const detailResponse = await fetch(
                                `https://a2sv-application-platform-backend-team2.onrender.com/manager/applications/${app.id}`,
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );

                            if (detailResponse.ok) {
                                const detailData = await detailResponse.json();
                                console.log(`Detail API Response for app ${app.id}:`, detailData);
                                if (detailData.success && detailData.data) {
                                    // Merge the basic app data with the detailed data
                                    const mergedApp = {
                                        ...app,
                                        ...detailData.data.application || detailData.data,
                                        applicant_name:
                                            app.applicant_name ||
                                            detailData.data.applicant_name ||
                                            detailData.data.application?.applicant_name ||
                                            "Unknown",
                                        submitted_at:
                                            app.submitted_at ||
                                            detailData.data.submitted_at ||
                                            detailData.data.application?.submitted_at ||
                                            detailData.data.created_at,
                                        assigned_reviewer_name:
                                            app.assigned_reviewer_name ||
                                            detailData.data.assigned_reviewer_name ||
                                            detailData.data.application?.assigned_reviewer_name ||
                                            "Not Assigned",
                                    };
                                    console.log(`Merged app ${app.id}:`, mergedApp);
                                    return mergedApp;
                                }
                            }
                        } catch (err) {
                            console.error(`Failed to fetch details for application ${app.id}:`, err);
                        }

                        // Return basic app data if detail fetch fails
                        return {
                            ...app,
                            applicant_name: app.applicant_name || "Unknown",
                            submitted_at: app.submitted_at || app.created_at,
                            assigned_reviewer_name: app.assigned_reviewer_name || "Not Assigned",
                        };
                    })
                );

                console.log("Final applications with details:", applicationsWithDetails);
                setApplications(applicationsWithDetails);
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // Assign reviewer to application
    const handleAssignReviewer = async (
        applicationId: string,
        reviewerId: string
    ) => {
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

    useEffect(() => {
        if (session && status === "authenticated") {
            fetchApplications();
        }
    }, [session, status]);

    const isLoading = loading || reviewersLoading || status === "loading";

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

    const reviewers = reviewersData?.data?.reviewers || [];

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
