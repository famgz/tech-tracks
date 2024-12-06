import { Progress } from "@/components/ui/progress";

interface Props {
  totalCourses: number;
  completedCourses: number;
}
export default function TrackProgress({
  totalCourses,
  completedCourses,
}: Props) {
  const progress = Math.round((completedCourses / totalCourses) * 100);

  return (
    <div className="flex-center flex-col gap-3">
      <p className="text-muted-foreground">
        {completedCourses}/{totalCourses} atividade
        {totalCourses > 1 ? "s" : ""}
      </p>
      <div className="flex-center gap-2 text-lg">
        <Progress value={progress || 5} className="h-2.5 w-28" /> {progress}%
      </div>
    </div>
  );
}
