import type { SVGProps } from "react";

type Capsule = {
  id: string;
  /** Unit direction from the mark's centre; the loader flies capsules along it. */
  dx: number;
  dy: number;
  isSoft: boolean;
  d: string;
};

/** Paths from the brand SVG, clockwise from the top. Diagonals are brand blue at 41%. */
const CAPSULES: readonly Capsule[] = [
  {
    id: "n", dx: 0, dy: -1, isSoft: false,
    d: "M537.375 122.25C537.375 95.7403 515.885 74.25 489.375 74.25C462.865 74.25 441.375 95.7403 441.375 122.25V306.25C441.375 332.76 462.865 354.25 489.375 354.25C515.885 354.25 537.375 332.76 537.375 306.25V122.25Z",
  },
  {
    id: "ne", dx: 1, dy: -1, isSoft: true,
    d: "M772.218 259.289C790.963 240.544 790.963 210.152 772.218 191.407C753.472 172.662 723.08 172.662 704.335 191.407L574.228 321.515C555.482 340.26 555.482 370.652 574.228 389.397C592.973 408.142 623.365 408.142 642.11 389.397L772.218 259.289Z",
  },
  {
    id: "e", dx: 1, dy: 0, isSoft: false,
    d: "M841.375 522.25C867.885 522.25 889.375 500.76 889.375 474.25C889.375 447.74 867.885 426.25 841.375 426.25H657.375C630.865 426.25 609.375 447.74 609.375 474.25C609.375 500.76 630.865 522.25 657.375 522.25H841.375Z",
  },
  {
    id: "se", dx: 1, dy: 1, isSoft: true,
    d: "M704.335 757.093C723.08 775.838 753.472 775.838 772.218 757.093C790.963 738.347 790.963 707.956 772.218 689.21L642.11 559.103C623.365 540.358 592.973 540.358 574.228 559.103C555.483 577.848 555.483 608.24 574.228 626.985L704.335 757.093Z",
  },
  {
    id: "s", dx: 0, dy: 1, isSoft: false,
    d: "M441.375 826.25C441.375 852.76 462.865 874.25 489.375 874.25C515.885 874.25 537.375 852.76 537.375 826.25V642.25C537.375 615.74 515.885 594.25 489.375 594.25C462.865 594.25 441.375 615.74 441.375 642.25V826.25Z",
  },
  {
    id: "sw", dx: -1, dy: 1, isSoft: true,
    d: "M206.532 689.21C187.787 707.956 187.787 738.348 206.532 757.093C225.277 775.838 255.669 775.838 274.415 757.093L404.522 626.985C423.267 608.24 423.267 577.848 404.522 559.103C385.777 540.358 355.385 540.358 336.64 559.103L206.532 689.21Z",
  },
  {
    id: "w", dx: -1, dy: 0, isSoft: false,
    d: "M137.375 426.25C110.865 426.25 89.375 447.74 89.375 474.25C89.375 500.76 110.865 522.25 137.375 522.25H321.375C347.885 522.25 369.375 500.76 369.375 474.25C369.375 447.74 347.885 426.25 321.375 426.25L137.375 426.25Z",
  },
  {
    id: "nw", dx: -1, dy: -1, isSoft: true,
    d: "M274.415 191.407C255.669 172.662 225.277 172.662 206.532 191.407C187.787 210.152 187.787 240.544 206.532 259.29L336.64 389.397C355.385 408.142 385.777 408.142 404.522 389.397C423.267 370.652 423.267 340.26 404.522 321.515L274.415 191.407Z",
  },
];

type IconProps = SVGProps<SVGSVGElement> & { color?: string };

export function VitragaIcon({ color = "currentColor", ...props }: IconProps) {
  return (
    <svg viewBox="89 74 800 800" fill="none" aria-hidden="true" {...props}>
      {CAPSULES.map((c) => (
        <path
          key={c.id}
          d={c.d}
          fill={color}
          fillOpacity={c.isSoft ? 0.41 : 1}
          data-capsule
          data-dx={c.dx}
          data-dy={c.dy}
          data-soft={c.isSoft || undefined}
        />
      ))}
    </svg>
  );
}

export function VitragaLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <VitragaIcon className="size-7" />
      <span className="font-mono text-base font-bold tracking-[0.12em]">
        VITRAGA
      </span>
    </span>
  );
}
