import Image from "next/image";
import { FC, useState } from "react";

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
}

const ApplicationCard: FC<Props> = ({ application, onStatusChange }) => {
  const { applicant_name, status, submission_date } = application;

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
      case "in_progress":
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
          <button className="w-full text-center px-4 py-2.5 rounded-lg font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            View Details
          </button>
        ) : (
          <a
            href="#" // Placeholder for review page link
            onClick={(e) => {
              e.preventDefault();
              fetch(
                `https://a2sv-application-platform-backend-team2.onrender.com/reviews/${application.application_id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ status: "in_progress" }),
                }
              ).catch(() => {});
              setLocalStatus("Under Review");
              if (onStatusChange) {
                onStatusChange(application.application_id, "in_progress");
              }
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
