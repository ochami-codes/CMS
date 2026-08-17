import {
  FaUsers,
  FaMoneyBillWave,
  FaBullhorn,
  FaShieldAlt,
  FaSitemap,
  FaClipboardList,
  FaChurch,
} from "react-icons/fa";

import Button from "../components/Button";
import styles from "../styles/pages/Home.module.css";
import Logo from "../components/Logo";
export default function Home() {
  const features = [
    {
      icon: FaShieldAlt,
      title: "Secure & Protected",
      desc: "Strong authentication and secure access keep your church data protected.",
    },
    {
      icon: FaSitemap,
      title: "Smart Authorization",
      desc: "Give leaders the right access based on their roles and responsibilities.",
    },
    {
      icon: FaUsers,
      title: "Department Management",
      desc: "Manage ministries, departments, leaders, and members from one place.",
    },
    {
      icon: FaMoneyBillWave,
      title: "Treasury Management",
      desc: "Track offerings, income, expenses, and financial records with confidence.",
    },
    {
      icon: FaBullhorn,
      title: "Church Announcements",
      desc: "Keep members informed with timely announcements and important updates.",
    },
    {
      icon: FaClipboardList,
      title: "Clerk Management",
      desc: "Organize membership records, transfers, baptisms, and church information.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero */}
     <section className={styles.hero}>
  <Logo
    variant="full"
    width={220}
    className={styles.heroLogo}
  />

  <div className={styles.badge}>
    <FaChurch />
    Built for churches
  </div>

  <h1>
    Your church.<br />
    <span>Better organized.</span>
  </h1>

  <p>
    A secure, all-in-one platform for managing church members,
    departments, finances, announcements, and leadership access.
  </p>

  <div className={styles.buttons}>
    <Button to="/register" variant="primary">
      Get Started
    </Button>

    <Button to="/login" variant="ghost">
      Sign In
    </Button>
  </div>
</section>

      {/* Features */}
      <section>
        <div className={styles.sectionHeader}>
          <h2>Everything your church needs</h2>
          <p>
            Simple tools. Secure access. Better church administration.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={styles.card}>
              <Icon />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Bring your church management together.</h2>

        <p>
          Manage your church operations securely from one place.
        </p>

        <Button to="/register" variant="light">
          Get Started
        </Button>
      </section>
    </div>
  );
}
