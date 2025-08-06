type ButtonProps = {
  text: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

export default function Button({ text, icon, onClick, type = 'submit' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full h-[38px] relative flex items-center justify-center text-[15px] font-[500] text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-[6px] px-[17px] py-[9px]"
    >
      {icon && (
        <span className="absolute left-[17px] flex items-center">
          {icon}
        </span>
      )}
      {text}
    </button>
  );
}
