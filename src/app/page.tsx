// <<<<<<< HEAD
// import Index from "./components";

// export default function Home() {
//   return <Index />
// }
// =======

import AllApplications from "@/components/AllApplications";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import DropDown from "@/components/DropDown";
import TeamPerformance from "./TeamPerformance";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="
      /ml-[159px]
      mt-[42px]  bg-gray-50
      min-h-screen  px-[100px]
      w-full overflow-auto pt-10">
        <div className="
        flex flex-col md:flex-row items-center
        gap-6">
          <StatCard title="Total Applications" count={1204} />
          <StatCard title="Under Review" count={750} />
          <StatCard title="Interview Stage" count={250} />
          <StatCard title="Accepted" count={82} />
        </div>
        <AllApplications />


      </main>
      {/* <DropDown /> */}
      <TeamPerformance teamMembers={[
        {}, {}
      ]} />

    </div>
  );
}
// >>>>>>> my-local-backup
