// src/icons/index.tsx
import React from "react";

/** Crea un componente de ícono basado en una ruta dentro de /public */
function makeIcon(src: string) {
  const Icon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
    alt,
    className,
    ...rest
  }) => (
    <img
      src={src}
      alt={alt ?? ""}
      className={className}
      aria-hidden={alt ? undefined : true}
      {...rest}
    />
  );
  return Icon;
}

// === Define aquí TODOS tus iconos apuntando a /public/icons ===
// (usa el mismo nombre de archivo que moviste a public/icons)
export const PlusIcon          = makeIcon("/icons/plus.svg");
export const CloseIcon         = makeIcon("/icons/close.svg");
export const BoxIcon           = makeIcon("/icons/box.svg");
export const CheckCircleIcon   = makeIcon("/icons/check-circle.svg");
export const AlertIcon         = makeIcon("/icons/alert.svg");
export const InfoIcon          = makeIcon("/icons/info.svg");
export const ErrorIcon         = makeIcon("/icons/info-hexa.svg");
export const BoltIcon          = makeIcon("/icons/bolt.svg");
export const ArrowUpIcon       = makeIcon("/icons/arrow-up.svg");
export const ArrowDownIcon     = makeIcon("/icons/arrow-down.svg");
export const FolderIcon        = makeIcon("/icons/folder.svg");
export const VideoIcon         = makeIcon("/icons/videos.svg");
export const AudioIcon         = makeIcon("/icons/audio.svg");
export const GridIcon          = makeIcon("/icons/grid.svg");
export const FileIcon          = makeIcon("/icons/file.svg");
export const DownloadIcon      = makeIcon("/icons/download.svg");
export const ArrowRightIcon    = makeIcon("/icons/arrow-right.svg");
export const GroupIcon         = makeIcon("/icons/group.svg");
export const BoxIconLine       = makeIcon("/icons/box-line.svg");
export const ShootingStarIcon  = makeIcon("/icons/shooting-star.svg");
export const DollarLineIcon    = makeIcon("/icons/dollar-line.svg");
export const TrashBinIcon      = makeIcon("/icons/trash.svg");
export const AngleUpIcon       = makeIcon("/icons/angle-up.svg");
export const AngleDownIcon     = makeIcon("/icons/angle-down.svg");
export const PencilIcon        = makeIcon("/icons/pencil.svg");
export const CheckLineIcon     = makeIcon("/icons/check-line.svg");
export const CloseLineIcon     = makeIcon("/icons/close-line.svg");
export const ChevronDownIcon   = makeIcon("/icons/chevron-down.svg");
export const ChevronUpIcon     = makeIcon("/icons/chevron-up.svg");
export const PaperPlaneIcon    = makeIcon("/icons/paper-plane.svg");
export const LockIcon          = makeIcon("/icons/lock.svg");
export const EnvelopeIcon      = makeIcon("/icons/envelope.svg");
export const UserIcon          = makeIcon("/icons/user-line.svg");
export const CalenderIcon      = makeIcon("/icons/calender-line.svg");
export const EyeIcon           = makeIcon("/icons/eye.svg");
export const EyeCloseIcon      = makeIcon("/icons/eye-close.svg");
export const TimeIcon          = makeIcon("/icons/time.svg");
export const CopyIcon          = makeIcon("/icons/copy.svg");
export const ChevronLeftIcon   = makeIcon("/icons/chevron-left.svg");
export const UserCircleIcon    = makeIcon("/icons/user-circle.svg");
export const TaskIcon          = makeIcon("/icons/task-icon.svg");
export const ListIcon          = makeIcon("/icons/list.svg");
export const TableIcon         = makeIcon("/icons/table.svg");
export const PageIcon          = makeIcon("/icons/page.svg");
export const PieChartIcon      = makeIcon("/icons/pie-chart.svg");
export const BoxCubeIcon       = makeIcon("/icons/box-cube.svg");
export const PlugInIcon        = makeIcon("/icons/plug-in.svg");
export const DocsIcon          = makeIcon("/icons/docs.svg");
export const MailIcon          = makeIcon("/icons/mail-line.svg");
export const HorizontaLDots    = makeIcon("/icons/horizontal-dots.svg");
export const ChatIcon          = makeIcon("/icons/chat.svg");