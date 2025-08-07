import { ReactNode } from "react";

export default function AuthHeader({title, subtitle}:{title:string, subtitle:ReactNode}){
    return (
        <div className="flex flex-col items-center text-center">
            <img src="/images/logo.svg" alt="A2sv logo" className="w-48 h-12 mb-7"/>
            <h2 className="font-extrabold text-3xl  font-[sans-serif] mb-2">{title}</h2>

            <p className=" text-[#4B5563]  font-medium ">{subtitle}</p>
            <div className="mb-10 w-full"></div>
        </div>
    );
}