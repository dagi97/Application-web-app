const TeamPerformance = ({ teamMembers, applications }: {
    teamMembers: Array<{ [key: string]: any }>,
    applications: Array<{ [key: string]: any }>
}) => {
    // Process reviewer performance data
    const processReviewerPerformance = (reviewers: any[], applications: any[]) => {
        return reviewers.map(reviewer => {
            const reviewerApps = applications.filter(app =>
                app.assigned_reviewer_name === reviewer.name ||
                app.assigned_reviewer_name === reviewer.reviewer_name ||
                app.reviewer_id === reviewer.id
            );

            const assignedCount = reviewerApps.length;

            const completedApps = reviewerApps.filter(app =>
                app.status === 'accepted' || app.status === 'rejected'
            );
            const completedCount = completedApps.length;

            // Calculate average days for assigned applications
            let averageDays = 0;
            if (reviewerApps.length > 0) {
                const totalDays = reviewerApps.reduce((sum, app) => {
                    if (app.submitted_at || app.submitted_date) {
                        const submitted = new Date(app.submitted_at || app.submitted_date);
                        const now = new Date();
                        const daysDiff = (now.getTime() - submitted.getTime()) / (1000 * 3600 * 24);
                        return sum + daysDiff;
                    }
                    return sum;
                }, 0);
                averageDays = totalDays / reviewerApps.length;
            }

            return {
                ...reviewer,
                assigned_count: assignedCount,
                average_days: Math.round(averageDays * 10) / 10, // Round to 1 decimal
                reviews_count: completedCount
            };
        });
    };

    const processedReviewers = processReviewerPerformance(teamMembers, applications || []);

    return (
        <div className="max-w-xs w-full bg-white rounded-lg shadow-md p-4 min-w-[350px]">
            <h3 className="font-bold text-[20px] leading-[28px] tracking-[0%] w-full mb-2">
                Team Performance
            </h3>
            <ul>
                {processedReviewers.map((teamMember, index) => {
                    const name = teamMember.name || teamMember.reviewer_name || teamMember.username || teamMember.full_name || teamMember.display_name || teamMember.email || 'Unknown Reviewer';
                    const assigned = teamMember.assigned_count || 0;
                    const average = teamMember.average_days || 0;
                    const reviews = teamMember.reviews_count || 0;
                    return (
                        <li key={index} className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium">{name}</p>
                                <p className="font-normal text-[14px] leading-[20px] text-[#6B7280]">
                                    {`${assigned} Assigned / Avg. ${average} days`}
                                </p>
                            </div>
                            <p className="font-normal text-[16px] leading-[24px] text-[#4B5563]">
                                {reviews + " Reviews"}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default TeamPerformance;
