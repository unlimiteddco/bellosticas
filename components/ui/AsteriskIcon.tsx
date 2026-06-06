type Props = {
  className?: string;
};

export function AsteriskIcon({ className }: Props) {
  return (
    <svg
      viewBox="-35 -35 70 70"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <polygon
        fill="currentColor"
        points="31.41 7.46 16.47 .02 31.25 -6.97 27.07 -16.92 6.7 -6.65 16.92 -26.93 7.46 -31.41 .02 -16.47 -6.97 -31.25 -16.92 -27.07 -6.65 -6.7 -26.93 -16.92 -31.41 -7.46 -16.47 -.02 -31.25 6.97 -27.07 16.92 -6.7 6.65 -16.92 26.93 -7.46 31.41 -.02 16.47 6.97 31.25 16.92 27.07 6.65 6.7 26.93 16.92 31.41 7.46"
      />
    </svg>
  );
}
