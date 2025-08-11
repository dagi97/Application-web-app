"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AllApplications from "@/app/components/AllApplications";
import HeaderManagerDetail from "@/app/components/HeaderManagerDetail";
import StatCard from "@/app/components/StatCard";
import TeamPerformance from "@/app/components/TeamPerformance";
import Footer from "@/app/components/Footer";
import {
    useAssignReviewerMutation,
    useGetAllReviewersQuery
} from "@/lib/redux/api/managerApi";

export default function DashboardPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: session, status } = useSession();

    // Initialize Redux API hooks
    const [assignReviewer] = useAssignReviewerMutation();
    const { data: reviewersData, isLoading: reviewersLoading, error: reviewersError } = useGetAllReviewersQuery();

    // Helper to get access token from NextAuth session (matching managerApi pattern)
    const getAccessToken = async () => {
        if (typeof window === "undefined") return null;

        // Try to get NextAuth session first
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        return session?.access || null;
    };

    // GET /manager/applications/ - List Applications with full details
    const fetchApplications = async () => {
        try {
            const token = await getAccessToken();

            if (!token) {
                setError("No access token found. Please sign in again.");
                setLoading(false);
                return;
            }

            const response = await fetch("https://a2sv-application-platform-backend-team2.onrender.com/manager/applications/", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Manager API Response:", data);

            if (data.success && data.data) {
                const basicApplications = data.data.applications || [];
                console.log("Basic applications from manager API:", basicApplications);

                // Check if the manager API already includes the fields we need
                const firstApp = basicApplications[0];
                console.log("First application structure:", firstApp);
                console.log("Available fields in manager API:", Object.keys(firstApp || {}));

                // Try to fetch full details for each application, but handle 403 errors gracefully
                const applicationsWithDetails = await Promise.all(
                    basicApplications.map(async (app: any) => {
                        try {
                            const detailResponse = await fetch(`https://a2sv-application-platform-backend-team2.onrender.com/applications/${app.id}`, {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`,
                                },
                            });

                            if (detailResponse.ok) {
                                const detailData = await detailResponse.json();
                                console.log(`Detail API Response for app ${app.id}:`, detailData);
                                if (detailData.success && detailData.data) {
                                    // Merge the basic app data with the detailed data
                                    const mergedApp = {
                                        ...app,
                                        ...detailData.data,
                                        applicant_name: app.applicant_name || detailData.data.applicant_name || "Unknown",
                                        submitted_at: app.submitted_at || detailData.data.submitted_at || detailData.data.created_at || detailData.data.updated_at,
                                        assigned_reviewer_name: app.assigned_reviewer_name || app.reviewer_name || detailData.data.assigned_reviewer_name || detailData.data.reviewer_name || "Not Assigned"
                                    };
                                    console.log(`Merged app ${app.id}:`, mergedApp);
                                    return mergedApp;
                                }
                            } else {
                                console.log(`Detail API failed for app ${app.id} with status: ${detailResponse.status}`);
                            }
                        } catch (err) {
                            console.error(`Failed to fetch details for application ${app.id}:`, err);
                        }

                        // Return basic app data if detail fetch fails - use available fields
                        return {
                            ...app,
                            applicant_name: app.applicant_name || app.applicant?.name || "Unknown",
                            submitted_at: app.submitted_at || app.created_at || app.updated_at || app.application_date || app.submission_date,
                            assigned_reviewer_name: app.assigned_reviewer_name || app.reviewer_name || app.reviewer?.name || "Not Assigned"
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


    useEffect(() => {
        const initializeApplications = async () => {
            try {
                const token = await getAccessToken();

                if (token) {
                    await fetchApplications();
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to initialize applications:", error);
                setLoading(false);
            }
        };

        initializeApplications();

        // Failsafe: Ensure loading doesn't stay true forever
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000); // 10 second timeout

        return () => clearTimeout(timeout);
    }, []); // Only run once on mount, following reviewer page pattern

    const isLoading = loading || reviewersLoading;

    if (isLoading) {
        return (
            <>
                <HeaderManagerDetail managerName={session?.user?.email || "Manager"} />
                <div className="flex-1 ml-[159px] mt-[42px] bg-gray-50 w-full overflow-auto pt-10 px-[100px]">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Loading...</div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <HeaderManagerDetail managerName={session?.user?.email || "Manager"} />
                <div className="flex-1 ml-[159px] mt-[42px] bg-gray-50 w-full overflow-auto pt-10 px-[100px]">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-red-600">Error: {error}</div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const reviewers = reviewersData?.data?.reviewers || [];

    return (
        <>
            <HeaderManagerDetail managerName={session?.user?.email || "Manager"} />

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
        </>
    );
}
