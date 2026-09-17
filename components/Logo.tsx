import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
}

export default function Logo({
  className = "",
  showText = true,
  size = "md",
  theme = "light",
}: LogoProps) {
  const iconSize = size === "sm" ? 32 : size === "lg" ? 44 : 38;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-display group select-none transition-all ${className}`}
    >
      <div
        className="relative rounded-xl overflow-hidden shadow-sm ring-1 ring-teal/30 group-hover:ring-teal group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.35)] transition-all duration-300 bg-navy shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <Image
          src="/logo.png"
          alt="LeadIntellect Logo Emblem"
          width={iconSize}
          height={iconSize}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSize} tracking-tight font-black flex items-center`}>
            <span className={theme === "dark" ? "text-white" : "text-navy"}>Lead</span>
            <span className="bg-gradient-to-r from-teal-dark via-teal to-violet bg-clip-text text-transparent">
              Intellect
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal ml-1 group-hover:scale-125 transition-transform" />
          </span>
          {size === "lg" && (
            <span className="text-[10px] font-bold text-text-muted tracking-widest uppercase mt-0.5">
              B2B Sales Intelligence
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
