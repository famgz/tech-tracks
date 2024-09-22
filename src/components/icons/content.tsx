import { cn } from "@/lib/utils";
import { ContentType } from "@prisma/client";
import {
  BookOpenCheckIcon,
  CircleHelpIcon,
  FileTextIcon,
  HeadphonesIcon,
  LucideProps,
  MonitorPlayIcon,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type Icon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

interface Props {
  contentType: ContentType;
  className?: string;
}

export default function ContentIcon({ contentType, className }: Props) {
  let IconComponent: Icon;

  switch (contentType) {
    case "audio":
      IconComponent = HeadphonesIcon;
      break;
    case "quiz":
      IconComponent = BookOpenCheckIcon;
      break;
    case "text":
      IconComponent = FileTextIcon;
      break;
    case "video":
      IconComponent = MonitorPlayIcon;
      break;
    default:
      IconComponent = CircleHelpIcon;
  }

  return (
    <IconComponent
      className={cn("size-5 bg-opacity-70 opacity-80", className)}
    />
  );
}
