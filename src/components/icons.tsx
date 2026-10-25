import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.4 10.4 13.5 13.5" />
    </Icon>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </Icon>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 3.5 10.5 8 6 12.5" />
    </Icon>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13 8H3M6.5 4.5 3 8l3.5 3.5" />
    </Icon>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13 8a5 5 0 1 1-1.6-3.7" />
      <path d="M13 3v3.2h-3.2" />
    </Icon>
  )
}

export function BranchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="5" cy="3.5" r="1.6" />
      <circle cx="5" cy="12.5" r="1.6" />
      <circle cx="11" cy="6" r="1.6" />
      <path d="M5 5.1v5.8M11 7.6c0 2.1-2 2.6-4 2.9" />
    </Icon>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="5.6" />
      <path d="M8 5.2V8l2 1.4" />
    </Icon>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8.6 6.6 11.6 12.6 4.8" />
    </Icon>
  )
}

export function CrossIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.4 4.4l7.2 7.2M11.6 4.4 4.4 11.6" />
    </Icon>
  )
}

export function RunningIcon(props: IconProps) {
  return (
    <Icon {...props} className={['status-icon--spin', props.className].filter(Boolean).join(' ')}>
      <circle cx="8" cy="8" r="5.6" opacity="0.3" />
      <path d="M13.6 8A5.6 5.6 0 0 0 8 2.4" />
    </Icon>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 2.8 14 13H2L8 2.8Z" />
      <path d="M8 6.6v2.9M8 11.6v.1" />
    </Icon>
  )
}

export function EmptyListIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 5.5h11M2.5 10.5h6" />
      <circle cx="11.5" cy="10.5" r="2.2" />
      <path d="M13.2 12.2 14.5 13.5" />
    </Icon>
  )
}
