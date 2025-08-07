import React from "react";
import Link from "next/link";

interface CycleCardProps {
  name: string;
  startDate: string;
  endDate: string;
}

const CycleCard: React.FC<CycleCardProps> = ({ name, startDate, endDate }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-sm max-w-4xl">
      <div className="p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{name}</h2>
        <p className="text-blue-100 mb-6">
          {"It's time to submit your application and show us your potential."}
        </p>
        <p className="text-sm mb-2">
          From <strong>{startDate}</strong> to <strong>{endDate}</strong>
        </p>
        <Link href="/applicant/application">
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors">
            Start Application
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CycleCard;
