// components/Modal.jsx

import {
  useEffect,
} from "react";

import {
  X,
} from "lucide-react";

import styles from
"../styles/components/Modal.module.css";

export default function Modal({

  open,

  onClose,

  title,

  children,

  footer,

  size = "md",

  closeOnBackdrop = true,

}) {

  useEffect(() => {

    const handleEsc =
      (e) => {

      if (
        e.key === "Escape"
      ) {
        onClose?.();
      }

    };

    document.addEventListener(
      "keydown",
      handleEsc
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleEsc
      );

  }, [onClose]);

  if (!open)
    return null;

  return (

<div
className={
styles.overlay
}

onClick={() =>
 closeOnBackdrop &&
 onClose?.()
}
>

<div

className={`
${styles.modal}
${styles[size]}
`}

onClick={(e)=>
e.stopPropagation()
}
>

{/* HEADER */}

<div
className={
styles.header
}
>

<h3>
 {title}
</h3>

<button
onClick={onClose}
className={
styles.close
}
>

<X size={18}/>

</button>

</div>


{/* BODY */}

<div
className={
styles.body
}
>

{children}

</div>


{/* FOOTER */}

{footer && (

<div
className={
styles.footer
}
>

{footer}

</div>

)}

</div>

</div>

);

}
