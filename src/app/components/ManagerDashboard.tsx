"use client";
import { useState, useEffect } from "react";
import AllApplications from "@/app/components/AllApplications";
import Header from "@/components/Header";
import StatCard from "@/app/components/StatCard";
import TeamPerformance from "@/app/components/TeamPerformance";
import { useAssignReviewerMutation } from "@/app/lib/redux/api/applicationApi";

// API base URL
const API_BASE = "https://a2sv-application-platform-backend.onrender.com";

export default function DashboardPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [reviewers, setReviewers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use existing Redux API for assignReviewer
    const [assignReviewer] = useAssignReviewerMutation();

    // GET /manager/applications/ - List Applications (USING MOCK DATA)
    const fetchApplications = async () => {
        try {
            // Mock response matching API format
            const mockResponse = {
                success: true,
                data: {
                    applications: [
                        {
                            id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
                            applicant_name: "John Doe",
                            status: "pending_review",
                            assigned_reviewer_name: null
                        },
                        {
                            id: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
                            applicant_name: "Jane Smith",
                            status: "in_progress",
                            assigned_reviewer_name: "Alice Reviewer"
                        },
                        {
                            id: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
                            applicant_name: "Bob Johnson",
                            status: "accepted",
                            assigned_reviewer_name: "Bob Reviewer"
                        }
                    ],
                    total_count: 3,
                    page: 1,
                    limit: 10
                },
                message: "Applications retrieved successfully"
            };

            setApplications(mockResponse.data.applications);

            // Real API call (commented out since auth isn't working)
            /*
            const response = await fetch(`${API_BASE}/manager/applications/`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setApplications(data.data?.applications || []);
            */
        } catch (err) {
            console.error("Failed to fetch applications:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    // GET /manager/applications/available-reviewers/ - Get Available Reviewers (USING MOCK DATA)
    const fetchReviewers = async () => {
        try {
            // Mock response matching API format with performance metrics
            const mockResponse = {
                success: true,
                data: {
                    reviewers: [
                        {
                            id: "3fa85f64-5717-4562-b3fc-2c963f66afb1",
                            full_name: "Alice Reviewer",
                            email: "alice@example.com",
                            name: "Alice Reviewer", // For TeamPerformance compatibility
                            assigned: 3,
                            average: 8,
                            reviews: 12
                        },
                        {
                            id: "3fa85f64-5717-4562-b3fc-2c963f66afb2",
                            full_name: "Bob Reviewer",
                            email: "bob@example.com",
                            name: "Bob Reviewer", // For TeamPerformance compatibility
                            assigned: 2,
                            average: 12,
                            reviews: 8
                        },
                        {
                            id: "3fa85f64-5717-4562-b3fc-2c963f66afb3",
                            full_name: "Carol Reviewer",
                            email: "carol@example.com",
                            name: "Carol Reviewer", // For TeamPerformance compatibility
                            assigned: 4,
                            average: 6,
                            reviews: 15
                        }
                    ],
                    total_count: 3
                },
                message: "Available reviewers retrieved successfully"
            };

            setReviewers(mockResponse.data.reviewers);

            // Real API call (commented out since auth isn't working)
            /*
            const response = await fetch(`${API_BASE}/manager/applications/available-reviewers?page=1&limit=10`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setReviewers(data.data?.reviewers || []);
            */
        } catch (err) {
            console.error("Failed to fetch reviewers:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    // PATCH /manager/applications/{application_id}/assign/ - Assign Reviewer (USING EXISTING REDUX API)
    const handleAssignReviewer = async (applicationId: string, reviewerId: string) => {
        try {
            // Use existing Redux API implementation
            await assignReviewer({ appId: applicationId, reviewer_id: reviewerId });

            // Refresh applications to show updated assignment
            await fetchApplications();

            return { success: true };
        } catch (err) {
            console.error("Failed to assign reviewer:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        }
    };

    // PATCH /manager/applications/{application_id}/decide/ - Decide Application (USING MOCK DATA)
    const handleDecideApplication = async (applicationId: string, status: string, decisionNotes: string) => {
        try {
            // Mock response matching API format
            console.log(`Mock decision ${status} for application ${applicationId}: ${decisionNotes}`);

            // Update the local applications array to reflect the decision
            setApplications(prev => prev.map(app =>
                app.id === applicationId
                    ? { ...app, status: status }
                    : app
            ));

            // Real API call (commented out since auth isn't working)
            /*
            const response = await fetch(`${API_BASE}/manager/applications/${applicationId}/decide`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: status,
                    decision_notes: decisionNotes
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Refresh applications after successful decision
            await fetchApplications();
            return data;
            */

            return { success: true };
        } catch (err) {
            console.error("Failed to make decision:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchApplications(),
                    fetchReviewers(),
                ]);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col">
                <Header />
                <main className="ml-[159px] mt-[42px] bg-gray-50 min-h-screen w-full overflow-auto pt-10 px-[100px]">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Loading dashboard...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col">
                <Header />
                <main className="ml-[159px] mt-[42px] bg-gray-50 min-h-screen w-full overflow-auto pt-10 px-[100px]">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-red-600">Error: {error}</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <Header />
            <main className="
      ml-[159px] 
      mt-[42px]  bg-gray-50 
      min-h-screen  px-[100px]
      w-full overflow-auto pt-10">
                <div className="
        flex flex-col md:flex-row items-center
        gap-6">
                    <StatCard title="Total Applications" count={applications.length || 0} />
                    <StatCard title="Under Review" count={applications.filter((app: any) => app.status === "pending_review").length || 0} />
                    <StatCard title="In Progress" count={applications.filter((app: any) => app.status === "in_progress").length || 0} />
                    <StatCard title="Accepted" count={applications.filter((app: any) => app.status === "accepted").length || 0} />
                </div>
                <div className=''>
                    <AllApplications
                        applications={applications}
                        reviewers={reviewers}
                        onAssignReviewer={handleAssignReviewer}
                        onDecideApplication={handleDecideApplication}
                    />
                    <TeamPerformance teamMembers={reviewers} />
                </div>
            </main>
        </div>
    );
}
