import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChurchSwitcher from "./ChurchSwitcher";
import styles from "../styles/components/Sidebar.module.css";
import sdaLogo from "../assets/sda-logo.png";
import { LayoutDashboard, Users, LogOut, Baby, Wallet, Church, Megaphone, Shield, User, X, Music, BookOpen, HeartHandshake, HandHelping, ClipboardList, PanelLeftClose } from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Home", path: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", path: "/dashboard/profiles", icon: User },
  { type: "group", label: "Ministries" },
  { label: "Pastor", path: "/dashboard/pastor", icon: Church, permission: "access_pastor_dashboard" },
  { label: "Treasury", path: "/dashboard/treasury", icon: Wallet, permission: "access_treasury_dashboard" },
  { label: "Communication", path: "/dashboard/communication", icon: Megaphone, permission: "access_media_dashboard" },
  { label: "Choir", path: "/dashboard/choir", icon: Music, permission: "access_choir_dashboard" },
  { label: "Youth", path: "/dashboard/youth", icon: Users, permission: "access_youth_dashboard" },
  { label: "Children", path: "/dashboard/children", icon: Baby, permission: "access_children_dashboard" },
  { label: "ALO", path: "/dashboard/alo", icon: BookOpen, permission: "access_alo_dashboard" },
  { label: "AMO", path: "/dashboard/amo", icon: HeartHandshake, permission: "access_amo_dashboard" },
  { label: "Church Clerk", path: "/dashboard/clerk", icon: ClipboardList, permission: "access_clerk_dashboard" },
  { label: "Sabbath School", path: "/dashboard/s-school", icon: BookOpen, permission: "access_school_dashboard" },
  { label: "Deaconry", path: "/dashboard/deaconry", icon: HandHelping, permission: "access_deaconry_dashboard" },
  { type: "group", label: "Admin" },
  { label: "Admin", path: "/dashboard/admin", icon: Shield, permission: "access_admin_dashboard" },
];

export default function Sidebar({ open, onClose, onLogout, collapsed, onToggleCollapse }) {
  const { user, activeChurch, canUser, isGuest } = useAuth();
  if (!user) return null;

  const churchName = activeChurch?.name || "Seventh-day Adventist Church";

  const visibleItems = SIDEBAR_ITEMS.filter(item => {
    if (item.type === "group") return true;
    if (!item.permission) return true;
    if (isGuest) return false;
    return canUser(item.permission);
  });

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className={styles.overlay} onClick={onClose} />}
      
      <aside className={`${styles.sidebar} ${open ? styles.open : ""} ${collapsed ? styles.collapsed : ""}`}>
        
        <div className={styles.header}>
          <div className={styles.brand}>
            <img src={sdaLogo} alt="SDA Logo" className={styles.logo} />
            {!collapsed && (
              <div className={styles.brandText}>
              <div className={styles.churchSwitcherPortal}> 
               <ChurchSwitcher />
                </div>
                <small className={styles.churchName}>{churchName}</small>
                {isGuest && <span className={styles.status}>{user.membership_status}</span>}
              </div>
            )}
          </div>

          <div className={styles.headerActions}>
            <button className={styles.collapseBtn} onClick={onToggleCollapse} aria-label="Toggle sidebar">
              <PanelLeftClose size={18} />
            </button>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close sidebar">
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className={styles.nav}>
          {visibleItems.map((item, idx) => {
            if (item.type === "group") {
              return !collapsed && (
                <div key={`group-${idx}`} className={styles.groupLabel}>{item.label}</div>
              );
            }
            
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className={styles.icon} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <button onClick={onLogout} className={styles.logout} title={collapsed ? "Logout" : undefined}>
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
