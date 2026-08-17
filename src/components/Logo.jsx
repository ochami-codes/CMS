import textlogo from "../assets/textlogo.png";
import textlesslogo from "../assets/textlesslogo.png";
import styles from "../styles/components/Logo.module.css";

const SIZES = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 72,
  xl: 96,
};

export default function Logo({
  variant = "full",
  size = "md",
  width,
  height,
  alt = "ChurchApp",
  className = "",
  ...props
}) {
  const isMark = variant === "mark";

  const resolvedWidth =
    width ?? (isMark ? SIZES[size] : undefined);

  const resolvedHeight =
    height ?? (isMark ? SIZES[size] : undefined);

  return (
    <img
      src={isMark ? textlesslogo : textlogo}
      alt={alt}
      className={`${styles.logo} ${styles[variant]} ${className}`}
      width={resolvedWidth}
      height={resolvedHeight}
      {...props}
    />
  );
}