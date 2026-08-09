import styles from "../styles/components/TextDisplay.module.css";

export default function TextDisplay({
  children,
  as: Component = "p",
  size = "md",
  color = "primary",
  bg = "none",
  weight = "normal",
  align = "left",
  className = "",
  ...props
}) {
  const classes = [
    styles.text,
    styles[`size-${size}`],
    styles[`color-${color}`],
    styles[`bg-${bg}`],
    styles[`weight-${weight}`],
    styles[`align-${align}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}