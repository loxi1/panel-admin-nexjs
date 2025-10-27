// src/icons/index.tsx
import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

function IconBase({
  children,
  className,
  ...rest
}: IconProps & { children?: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      stroke="currentColor"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children ?? <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}

// Placeholder genérico para íconos que aún no usas/definas
function PlaceholderIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </IconBase>
  );
}

/* ==== Íconos usados en tus pantallas ==== */
export function ChevronLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <polyline points="15 18 9 12 15 6" />
    </IconBase>
  );
}
export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <polyline points="6 9 12 15 18 9" />
    </IconBase>
  );
}
export function ChevronUpIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <polyline points="6 15 12 9 18 15" />
    </IconBase>
  );
}
export function EyeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  );
}
export function EyeCloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </IconBase>
  );
}
export function CalenderIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </IconBase>
  );
}
export function TimeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}
export function EnvelopeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </IconBase>
  );
}
export function PlusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  );
}
export function BoxIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12l8.73-5.04M12 22V12" />
    </IconBase>
  );
}
export function MoreDotIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </IconBase>
  );
}

/* ==== Exports “de relleno” para nombres que el proyecto podría importar ==== */
export const CloseIcon = PlaceholderIcon;
export const CheckCircleIcon = PlaceholderIcon;
export const AlertIcon = PlaceholderIcon;
export const InfoIcon = PlaceholderIcon;
export const ErrorIcon = PlaceholderIcon;
export const BoltIcon = PlaceholderIcon;
export const ArrowUpIcon = PlaceholderIcon;
export const ArrowDownIcon = PlaceholderIcon;
export const FolderIcon = PlaceholderIcon;
export const VideoIcon = PlaceholderIcon;
export const AudioIcon = PlaceholderIcon;
export const GridIcon = PlaceholderIcon;
export const FileIcon = PlaceholderIcon;
export const DownloadIcon = PlaceholderIcon;
export const ArrowRightIcon = PlaceholderIcon;
export const GroupIcon = PlaceholderIcon;
export const BoxIconLine = PlaceholderIcon;
export const ShootingStarIcon = PlaceholderIcon;
export const DollarLineIcon = PlaceholderIcon;
export const TrashBinIcon = PlaceholderIcon;
export const AngleUpIcon = PlaceholderIcon;
export const AngleDownIcon = PlaceholderIcon;
export const PencilIcon = PlaceholderIcon;
export const CheckLineIcon = PlaceholderIcon;
export const CloseLineIcon = PlaceholderIcon;
export const PaperPlaneIcon = PlaceholderIcon;
export const LockIcon = PlaceholderIcon;
export const UserIcon = PlaceholderIcon;
export const CopyIcon = PlaceholderIcon;
export const ChevronLeft = PlaceholderIcon;
export const UserCircleIcon = PlaceholderIcon;
export const TaskIcon = PlaceholderIcon;
export const ListIcon = PlaceholderIcon;
export const TableIcon = PlaceholderIcon;
export const PageIcon = PlaceholderIcon;
export const PieChartIcon = PlaceholderIcon;
export const BoxCubeIcon = PlaceholderIcon;
export const PlugInIcon = PlaceholderIcon;
export const DocsIcon = PlaceholderIcon;
export const MailIcon = PlaceholderIcon;
export const HorizontaLDots = PlaceholderIcon;
export const ChatIcon = PlaceholderIcon;