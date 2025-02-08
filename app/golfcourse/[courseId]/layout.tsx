//components
import Stepper from "@/app/components/stepper";
import { ProgressProvider } from "../context/progress-context";
export default function GolfCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      {children}
      <Stepper />
    </ProgressProvider>
  );
}
