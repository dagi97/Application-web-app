export interface ReviewDetail {
  id: string;
  name: string;
  school: string;
  degree: string;
  leetcode: string;
  codeforces: string;
  essays: Array<{
    question: string;
    answer: string;
  }>;
  resumeURL: string;
  status: string;
  studentId: string;
  country: string;
  submittedAt: string;
  updatedAt: string;
  reviewDetails: {
    id: string;
    applicationId: string;
    reviewerId: string;
    activityCheckNotes: string;
    resumeScore: number;
    essayWhyA2svScore: number;
    essayAboutYouScore: number;
    technicalInterviewScore: number;
    behavioralInterviewScore: number;
    interviewNotes: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function mapApiToReviewDetail(api: any): ReviewDetail {
  const applicant = api?.data?.application || {};
  const review = api?.data?.review_details || {};
  return {
    id: applicant.id,
    name: applicant.applicant_name,
    school: applicant.school,
    degree: applicant.degree,
    leetcode: applicant.leetcode_handle,
    codeforces: applicant.codeforces_handle,
    essays: [
      {
        question: "Essay 1: Tell us about yourself?",
        answer: applicant.essay_about_you,
      },
      {
        question: "Essay 2: Why do you want to join us?",
        answer: applicant.essay_why_a2sv,
      },
    ],
    resumeURL: applicant.resume_url,
    status: applicant.status,
    studentId: applicant.student_id,
    country: applicant.country,
    submittedAt: applicant.submitted_at,
    updatedAt: applicant.updated_at,
    reviewDetails: {
      id: review.id,
      applicationId: review.application_id,
      reviewerId: review.reviewer_id,
      activityCheckNotes: review.activity_check_notes,
      resumeScore: review.resume_score,
      essayWhyA2svScore: review.essay_why_a2sv_score,
      essayAboutYouScore: review.essay_about_you_score,
      technicalInterviewScore: review.technical_interview_score,
      behavioralInterviewScore: review.behavioral_interview_score,
      interviewNotes: review.interview_notes,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    },
  };
}
