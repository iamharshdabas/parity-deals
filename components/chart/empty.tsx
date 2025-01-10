import { subtitle } from "@/config/class-variants";

export default function EmptyChart() {
  return (
    <div className="flex justify-center items-center min-h-32 max-h-64">
      <h1 className={subtitle()}>No Data to show</h1>
    </div>
  );
}
