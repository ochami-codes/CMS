import { Link } from "react-router-dom";
import {
  FaUsers,
  FaMoneyBillWave,
  FaBullhorn,
  FaLock,
  FaUserPlus,
  FaEnvelope,
  FaSignInAlt,
  FaChurch,
  FaClipboardList,
} from "react-icons/fa";

import Button from "../components/Button";
import Card from "../components/Card";
import styles from "../styles/pages/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      
      <section className={styles.hero}>
        <div className={styles.badge}>
          <FaChurch /> Built for churches
        </div>

        <h1>
          Church management,<br />
          <span>made simple</span>
        </h1>

        <p>
          Track members, finances, and ministries in one clean dashboard. 
          No spreadsheets, no confusion.
        </p>

        <div className={styles.buttons}>
          <Button to="/register" variant="primary">Get Started</Button>
          <Button to="/login" variant="ghost">Sign In</Button>
        </div>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <h2>Everything you need</h2>
          <p>Built around how churches actually operate</p>
        </div>

        <div className={styles.grid}>
          {[
            { icon: FaClipboardList, title: "Membership", desc: "Registers, baptisms, transfers, and member status in one place." },
            { icon: FaUsers, title: "Departments", desc: "Organize youth, Sabbath school, music, and other ministries." },
            { icon: FaMoneyBillWave, title: "Treasury", desc: "Log offerings, expenses, and generate reports instantly." },
            { icon: FaBullhorn, title: "Announcements", desc: "Send updates to the whole church with one click." },
            { icon: FaLock, title: "Roles & Access", desc: "Control who sees what with pastor, elder, and clerk roles." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className={styles.card}>
              <Icon />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to get organized?</h2>
        <p>Set up your church in under 5 minutes</p>
        <Button to="/register" variant="light">Create Free Account</Button>
      </section>
    </div>
  );
}
