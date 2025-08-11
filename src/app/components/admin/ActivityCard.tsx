import React from 'react';

const ActivityCard = () => {
  return (
    <div>
      <h3 className="text-[#111827] text-lg sm:text-xl font-bold mb-4">
        Recent Admin Activity
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <img
            src="/user.svg"
            alt="User Icon"
            className="w-7 h-7 mt-0.5 sm:w-auto sm:h-auto sm:mt-0"
          />
          <div>
            <p className="text-[#374151] text-sm sm:text-base font-normal">
              New User {"'Jane R.'"} created.
            </p>
            <p className="text-[#6B7280] font-normal text-xs sm:text-sm">
              2 hours ago
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <img
            src="/calendar.svg"
            alt="Calendar Icon"
            className="w-7 h-7 mt-0.5 sm:w-auto sm:h-auto sm:mt-0"
          />
          <div>
            <p className="text-[#374151] text-sm sm:text-base font-normal">
              Cycle {"'G7 November'"} set to active.
            </p>
            <p className="text-[#6B7280] font-normal text-xs sm:text-sm">
              1 day ago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;