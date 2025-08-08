export interface Review {
  application_id: string;
  applicant_name: string;
  status: string;
  submission_date: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    total_count: number;
    page: number;
    limit: number;
  };
  message: string;
}
