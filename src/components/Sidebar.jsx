import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChurchSwitcher from "./ChurchSwitcher";
import styles from "../styles/components/Sidebar.module.css";
import sdaLogo from "../assets/sda-logo.png";

import {
  LayoutDashboard,
  Users,
  Baby,
  Wallet,
  Church,
  Megaphone,
  Shield,
  User,
  X,
  Music,
  BookOpen,
  HeartHandshake,
  HandHelping,
  ClipboardList,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Home", path: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", path: "/dashboard/profiles", icon: User },

  { label: "Pastor", path: "/dashboard/pastor", icon: Church, permission: "access_pastor_dashboard" },
  { label: "Treasury", path: "/dashboard/treasury", icon: Wallet, permission: "access_treasury_dashboard" },
  { label: "Communication", path: "/dashboard/communication", icon: Megaphone, permission: "access_media_dashboard" },

  { label: "Choir", path: "/dashboard/choir", icon: Music, permission: "access_choir_dashboard" },
  { label: "Youth", path: "/dashboard/youth", icon: Users, permission: "access_youth_dashboard" },
  { label: "Children", path: "/dashboard/children", icon: Baby, permission: "access_children_dashboard" },
  { label: "ALO", path: "/dashboard/alo", icon: BookOpen, permission: "access_alo_dashboard" },
  { label: "AMO", path: "/dashboard/amo", icon: HeartHandshake, permission: "access_amo_dashboard" },
  { label: "Church Clerk", path: "/dashboard/clerk", icon: ClipboardList, permission: "access_clerk_dashboard" },
  { label: "Sabbath School", path: "/dashboard/s-school", icon: BookOpen, permission: "access_s_school_dashboard" },
  { label: "Deaconry", path: "/dashboard/deaconry", icon: HandHelping, permission: "access_deaconry_dashboard" },

  { label: "Admin", path: "/dashboard/admin", icon: Shield, permission: "access_admin_dashboard" },
];

export default function Sidebar({ open, onClose, onLogout }) {

  const {
    user,
    activeChurch,
    canUser,
    isGuest,
  } = useAuth();

  if (!user) return null;

  const churchName =
    activeChurch?.name ||
    "Seventh-day Adventist Church";

  const visibleItems = SIDEBAR_ITEMS.filter(item => {
    if (!item.permission) return true;
    if (isGuest) return false;
    return canUser(item.permission);
  });

  return (
    <aside
      className={`${styles.sidebar} ${
        open ? styles.open : ""
      }`}
    >

      {/* HEADER */}
      <div className={styles.header}>

        <div className={styles.brand}>

          <img
            src={sdaLogo}
            alt="SDA Logo"
            className={styles.logo}
          />

          <div className={styles.brandText}>

            <ChurchSwitcher />

            <small className={styles.churchName}>
              {churchName}
            </small>

            {isGuest && (
              <span className={styles.status}>
                {user.membership_status}
              </span>
            )}

          </div>
        </div>

        <button
          className={styles.closeBtn}
          onClick={onClose}
        >
          <X size={20} />
        </button>

      </div>

      {/* NAV */}
      <nav className={styles.nav}>

        {visibleItems.map(item => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.link} ${
                  isActive ? styles.active : ""
                }`
              }
            >
              <Icon
                size={18}
                className={styles.icon}
              />

              <span>{item.label}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* FOOTER */}
      <div className={styles.footer}>

        <button
          onClick={onLogout}
          className={styles.logout}
        >
          Logout
        </button>

      </div>

    </aside>
  );
}
