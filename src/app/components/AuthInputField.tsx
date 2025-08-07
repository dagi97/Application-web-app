import { InputHTMLAttributes } from 'react';

type Props = {
  isLast: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputField({
  type,
  name,
  placeholder,
  isLast,
  ...rest
}: Props) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      {...rest}
      className={`bg-white placeholder:text-[#6B7280] w-full h-[36px] px-[13px] py-[10px]  focus:outline-none ${isLast ? '' : 'border-b-[1.5px] border-[#D1D5DB]'}`}
    />
  );
}
