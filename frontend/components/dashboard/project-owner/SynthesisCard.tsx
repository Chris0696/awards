export default function SynthesisCard({
  title,
  data,
}: {
  title: string;
  data: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 space-y-6 w-full  lg:max-w-[300px] ">
      <h4 className="text-gray-700">{title} </h4>
      <h3 className="text-primary font-bold text-3xl">{data} </h3>
    </div>
  );
}
