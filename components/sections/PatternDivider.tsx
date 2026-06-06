import { BrandPattern } from "@/components/ui/BrandPattern";

type Props = {
  height?: number;
  size?: "xs" | "sm" | "md" | "lg";
};

export function PatternDivider({ height = 70, size = "sm" }: Props) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height, backgroundColor: "#1D1D1B" }}
    >
      <BrandPattern size={size} asBackground />
    </div>
  );
}
