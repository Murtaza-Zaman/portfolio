import { SOCIAL_COLOR_VARIANTS, getSocialIcon } from "../../utils/socialUtils.js";

/**
 * SocialGlowButton — Glowing circular social media redirect button.
 */
export function SocialGlowButton({
  platform = "Website",
  url = "#",
  label = "",
  color = "cyan",
  size = "md",
  className = "",
}) {
  const Icon = getSocialIcon(platform || label);
  const colorStyle = SOCIAL_COLOR_VARIANTS[color] || SOCIAL_COLOR_VARIANTS.cyan;
  const displayLabel = label || platform;

  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-13 w-13 text-base",
  }[size] || "h-11 w-11 text-sm";

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 22,
  }[size] || 18;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={displayLabel}
      className={`group/glow relative inline-flex items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050c1a] ${sizeClasses} ${colorStyle.base} ${colorStyle.hover} ${colorStyle.ring} ${className}`}
    >
      <Icon size={iconSizes} className="transition-transform duration-300 group-hover/glow:scale-110" />
    </a>
  );
}
