// src/components/Button.jsx
import styles from "../styles/components/Button.module.css";

export default function Button({
  children,
  variant="primary",
  ...props
}) {

 return(
   <button
      className={
        `${styles.btn}
         ${styles[variant]}`
      }

      {...props}
   >
      {children}
   </button>
 )
}
