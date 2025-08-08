import Image from "next/image";
<<<<<<< HEAD
import { FC, useState, useEffect } from "react";
import { fetchReviewDetails } from "../../lib/redux/utils/login";
import { useRouter } from "next/navigation";
=======
import { FC, useState } from "react";
>>>>>>> origin/main

type Status = "Under Review" | "Review Complete" | "New";
interface Application {
  application_id: string;
  applicant_name: string;
  status: string;
  submission_date: string;
}

const statusStyles: Record<string, string> = {
  "Under Review": "bg-[#FEF9C3] text-[#854D0E]",
  "Review Complete": "bg-[#DBEAFE] text-[#166534]",
  New: "bg-[#DBEAFE] text-[#166534]",
};

interface Props {
  application: Application;
  onStatusChange?: (application_id: string, newStatus: string) => void;
<<<<<<< HEAD
  reviewerName: string;
}

const ApplicationCard: FC<Props> = ({
  application,
  onStatusChange,
  reviewerName,
}) => {
  const { applicant_name, status, submission_date, application_id } =
    application;
  const router = useRouter();
=======
}

const ApplicationCard: FC<Props> = ({ application, onStatusChange }) => {
  const { applicant_name, status, submission_date } = application;
>>>>>>> origin/main

  let formattedDate = "";
  if (submission_date) {
    const dateObj = new Date(submission_date);
    formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  // temp avatar, check where it is later
<<<<<<< HEAD
  const avatarURL = "/images/person.png";
  const [reviewDetails, setReviewDetails] = useState<any>(null);
  const [displayStatus, setDisplayStatus] = useState<Status>(() => {
    if (status === "accepted" || status === "rejected")
      return "Review Complete";
    return "New";
  });

  useEffect(() => {
    let ignore = false;
    const getDetails = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token") || undefined
          : undefined;
      const details = await fetchReviewDetails(application_id, token);
      if (!ignore) {
        setReviewDetails(details);
        if (status !== "accepted" && status !== "rejected") {
          if (details && details.review_details) {
            setDisplayStatus("Under Review");
          } else {
            setDisplayStatus("New");
          }
        }
      }
    };
    getDetails();
    return () => {
      ignore = true;
    };
  }, [application_id, status]);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      {/* Debug log for reviewDetails - remove later
      <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-900">
        <strong>Debug reviewDetails:</strong>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {JSON.stringify(reviewDetails, null, 2)}
        </pre>
      </div> */}
=======
  const avatarURL = "/abel.png";
  const [localStatus, setLocalStatus] = useState<Status | null>(null);

  let displayStatus: Status;
  if (localStatus) {
    displayStatus = localStatus;
  } else {
    switch (status) {
      case "pending_review":
        displayStatus = "New";
        break;
      case "under_review":
        displayStatus = "Under Review";
        break;
      case "accepted":
        displayStatus = "Review Complete";
        break;
      default:
        displayStatus = "New";
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
>>>>>>> origin/main
      <div>
        <div className="flex items-start gap-4 mb-4">
          <Image
            src={avatarURL}
            alt={applicant_name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold">{applicant_name}</h3>
            <p className="text-sm text-gray-500">Submitted: {formattedDate}</p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[displayStatus]}`}
        >
          {displayStatus}
        </span>
      </div>
      <div className="mt-6">
        {displayStatus === "Review Complete" ? (
<<<<<<< HEAD
          <button
            className="w-full text-center px-4 py-2.5 rounded-lg font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            onClick={() => {
              if (reviewDetails) {
                sessionStorage.setItem(
                  `reviewDetails-${application_id}`,
                  JSON.stringify(reviewDetails)
                );
              }
              router.push(
                `/reviewdetails/${application_id}?reviewerName=${encodeURIComponent(
                  reviewerName
                )}&readonly=true&status=${status}`
              );
            }}
          >
=======
          <button className="w-full text-center px-4 py-2.5 rounded-lg font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
>>>>>>> origin/main
            View Details
          </button>
        ) : (
          <a
<<<<<<< HEAD
            href={`/reviewdetails/${application_id}`}
            onClick={async (e) => {
              e.preventDefault();
              if (onStatusChange) {
                onStatusChange(application_id, "under_review");
              }
              await fetch(
                `https://a2sv-application-platform-backend-team2.onrender.com/reviews/${application_id}`,
=======
            href="#" // Placeholder for review page link
            onClick={(e) => {
              e.preventDefault();
              fetch(
                `https://a2sv-application-platform-backend-team2.onrender.com/reviews/${application.application_id}`,
>>>>>>> origin/main
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ status: "under_review" }),
                }
              ).catch(() => {});
<<<<<<< HEAD
              router.push(
                `/reviewdetails/${application_id}?reviewerName=${encodeURIComponent(
                  reviewerName
                )}`
              );
=======
              setLocalStatus("Under Review");
              if (onStatusChange) {
                onStatusChange(application.application_id, "under_review");
              }
>>>>>>> origin/main
            }}
            className="w-full block text-center px-4 py-2.5 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
          >
            {displayStatus === "Under Review"
              ? "Continue Review"
              : "Start Review"}
          </a>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
