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

import Card from "../components/Card";
import styles from "../styles/pages/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>

      {/* HERO */}
      <section className={styles.hero}>

        <div className={styles.badge}>
          <FaChurch />
          Built for churches
        </div>

        <h1>
          Manage your church
          <span> simply & securely</span>
        </h1>

        <p>
          Membership records, departments, treasury,
          announcements, and church roles —
          all in one platform.
        </p>

        <div className={styles.buttons}>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>

          <Link to="/login" className="btn btn-outline">
            Sign In
          </Link>
        </div>

        <div className={styles.stats}>
          <Card>
            <strong>Members</strong>
            <span>Records & transfers</span>
          </Card>

          <Card>
            <strong>Departments</strong>
            <span>Manage ministries</span>
          </Card>

          <Card>
            <strong>Treasury</strong>
            <span>Track finances</span>
          </Card>
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section>

        <h2 className={styles.sectionTitle}>
          Getting started is easy
        </h2>

        <div className={styles.grid}>

          <Card>
            <FaUserPlus />
            <h3>Create account</h3>
            <p>Register your church profile.</p>
          </Card>

          <Card>
            <FaEnvelope />
            <h3>Verify email</h3>
            <p>Confirm ownership securely.</p>
          </Card>

          <Card>
            <FaSignInAlt />
            <h3>Start managing</h3>
            <p>Access your dashboard instantly.</p>
          </Card>

        </div>

      </section>

      {/* FEATURES */}
     

        <h2 className={styles.sectionTitle}>
          Everything churches need
        </h2>

        <div className={styles.grid}>

          <Card>
            <FaClipboardList />
            <h3>Church Clerk</h3>
            <p>
              Membership registers,
              baptisms, transfers,
              missing members.
            </p>
          </Card>

          <Card>
            <FaUsers />
            <h3>Departments</h3>
            <p>
              Youth, Sabbath School,
              Children, Music & more.
            </p>
          </Card>

          <Card>
            <FaMoneyBillWave />
            <h3>Treasury</h3>
            <p>
              Track offerings,
              expenses and funds.
            </p>
          </Card>

          <Card>
            <FaBullhorn />
            <h3>Announcements</h3>
            <p>
              Reach the whole church.
            </p>
          </Card>

          <Card>
            <FaLock />
            <h3>Role Permissions</h3>
            <p>
              Pastor, elder,
              clerk, member access.
            </p>
          </Card>

        </div>


      {/* CTA */}
      <section className={styles.cta}>

        <h2>
          Ready to organize your church?
        </h2>

        <p>
          Start using the platform today.
        </p>

        <Link to="/register" className="btn btn-primary">
          Create Account
        </Link>

      </section>

    </div>
  );
}
