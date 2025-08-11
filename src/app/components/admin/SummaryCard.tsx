import React from 'react';
import SummaryCardProps from '@/types/SummaryCard';

const SummaryCard = ({ title, number }: SummaryCardProps) => {
  return (
    <div>
      <p className="text-white text-sm sm:whitespace-nowrap">{title}</p>
      <p className="text-white font-bold text-2xl sm:text-3xl">{number}</p>
    </div>
  );
};

export default SummaryCard;