import styles from "../styles/components/Avatar.module.css";

export default function Avatar({
  name = "",
  image = "",
  size = "md"
}) {

  // Get initials from name
  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .map(word => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className={styles.image}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
