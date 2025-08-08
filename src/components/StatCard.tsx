type Props = {
  title: string;
  count: number;
};

export default function StatCard({ title, count }: Props) {
  return (
    <div
      className="rounded-lg p-6 shadow-md w-[366px] bg-white
      min-h-[100px] py-8
      "
    >
      <h3 className="text-sm font-medium mb-2 text-[#6B7280]">{title}</h3>
      <p className="text-3xl font-semibold">{count}</p>
    </div>
  );
}
