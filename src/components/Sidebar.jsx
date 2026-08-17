import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChurchSwitcher from "./ChurchSwitcher";

import styles from "../styles/components/Sidebar.module.css";
import sdaLogo from "../assets/sda-logo.png";

import {
  LayoutDashboard,
  Users,
  LogOut,
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

/* -------------------------
   Sidebar Items
------------------------- */

const SIDEBAR_ITEMS = [
  {
    label: "Home",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    path: "/dashboard/profiles",
    icon: User,
  },

  {
    type: "group",
    key: "ministries",
    label: "Ministries",
  },

  {
    label: "Pastor",
    path: "/dashboard/pastor",
    icon: Church,
    permission: "access_pastor_dashboard",
    group: "ministries",
  },
  {
    label: "Treasury",
    path: "/dashboard/treasury",
    icon: Wallet,
    permission: "access_treasury_dashboard",
    group: "ministries",
  },
  {
    label: "Communication",
    path: "/dashboard/communication",
    icon: Megaphone,
    permission: "access_media_dashboard",
    group: "ministries",
  },
  {
    label: "Music",
    path: "/dashboard/choir",
    icon: Music,
    permission: "access_choir_dashboard",
    group: "ministries",
  },
  {
    label: "Youth",
    path: "/dashboard/youth",
    icon: Users,
    permission: "access_youth_dashboard",
    group: "ministries",
  },
  {
    label: "Children",
    path: "/dashboard/children",
    icon: Baby,
    permission: "access_children_dashboard",
    group: "ministries",
  },
  {
    label: "ALO",
    path: "/dashboard/alo",
    icon: BookOpen,
    permission: "access_alo_dashboard",
    group: "ministries",
  },
  {
    label: "AMO",
    path: "/dashboard/amo",
    icon: HeartHandshake,
    permission: "access_amo_dashboard",
    group: "ministries",
  },
  {
    label: "Church Clerk",
    path: "/dashboard/clerk",
    icon: ClipboardList,
    permission: "access_clerk_dashboard",
    group: "ministries",
  },
  {
    label: "Sabbath School",
    path: "/dashboard/s-school",
    icon: BookOpen,
    permission: "access_s_school_dashboard",
    group: "ministries",
  },
  {
    label: "Deaconry",
    path: "/dashboard/deaconry",
    icon: HandHelping,
    permission: "access_deaconry_dashboard",
    group: "ministries",
  },

  {
    type: "group",
    key: "admin",
    label: "Admin",
  },

  {
    label: "Admin",
    path: "/dashboard/admin",
    icon: Shield,
    permission: "access_admin_dashboard",
    group: "admin",
  },
];

/* -------------------------
   Sidebar
------------------------- */

export default function Sidebar({
  open,
  onClose,
  onLogout,
  collapsed,
  onToggleCollapse,
}) {
  const { user, canUser } = useAuth();

  if (!user) return null;

  const activeChurch = user.activeChurch ?? null;

  const churchName =
    activeChurch?.name ??
    "Seventh-day Adventist Church";

  const membershipStatus =
    activeChurch?.status ?? "none";

  const isGuest =
    membershipStatus !== "active" &&
    membershipStatus !== "suspended";

  /* -------------------------
     Filter Visible Items
  ------------------------- */

  const visibleItems = SIDEBAR_ITEMS.filter(
    (item) => {
      if (item.type === "group") {
        return false;
      }

      if (!item.permission) {
        return true;
      }

      if (isGuest) {
        return false;
      }

      return canUser(item.permission);
    }
  );

  const hasMinistryItems =
    visibleItems.some(
      (item) =>
        item.group === "ministries"
    );

  const hasAdminItems =
    visibleItems.some(
      (item) =>
        item.group === "admin"
    );

  const renderNavigation = () =>
    visibleItems.filter(
      (item) => !item.group
    );

  const renderNavItem = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `${styles.link} ${
            isActive
              ? styles.active
              : ""
          }`
        }
        title={
          collapsed
            ? item.label
            : undefined
        }
      >
        <Icon
          size={20}
          className={styles.icon}
        />

        {!collapsed && (
          <span>{item.label}</span>
        )}
      </NavLink>
    );
  };

  const renderGroup = (
    group,
    label
  ) => {
    const items =
      visibleItems.filter(
        (item) =>
          item.group === group
      );

    if (!items.length) {
      return null;
    }

    return (
      <>
        {!collapsed && (
          <div
            className={
              styles.groupLabel
            }
          >
            {label}
          </div>
        )}

        {items.map(renderNavItem)}
      </>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className={styles.overlay}
          onClick={onClose}
        />
      )}

      <aside
        className={`
          ${styles.sidebar}
          ${open ? styles.open : ""}
          ${collapsed ? styles.collapsed : ""}
        `}
      >
        {/* -------------------------
            Header
        ------------------------- */}

        <div className={styles.header}>
          <div className={styles.brand}>
            <img
              src={sdaLogo}
              alt="SDA Logo"
              className={styles.logo}
            />

            {!collapsed && (
              <div
                className={
                  styles.brandText
                }
              >
                <div
                  className={
                    styles.churchSwitcherPortal
                  }
                >
                  <ChurchSwitcher />
                </div>

                <small
                  className={
                    styles.churchName
                  }
                >
                  {churchName}
                </small>

                {isGuest && (
                  <span
                    className={
                      styles.status
                    }
                  >
                    {membershipStatus}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Header actions */}
          <div
            className={
              styles.headerActions
            }
          >
            {/* Desktop collapse */}
            <button
              className={
                styles.collapseBtn
              }
              onClick={
                onToggleCollapse
              }
              aria-label={
                collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              title={
                collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
            >
              {collapsed ? (
                <PanelLeftOpen
                  size={18}
                />
              ) : (
                <PanelLeftClose
                  size={18}
                />
              )}
            </button>

            {/* Mobile close */}
            <button
              className={
                styles.closeBtn
              }
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* -------------------------
            Navigation
        ------------------------- */}

        <div
          className={
            styles.scrollArea
          }
        >
          <nav className={styles.nav}>
            {renderNavigation().map(
              renderNavItem
            )}

            {hasMinistryItems &&
              renderGroup(
                "ministries",
                "Ministries"
              )}

            {hasAdminItems &&
              renderGroup(
                "admin",
                "Admin"
              )}
          </nav>
        </div>

        {/* -------------------------
            Footer
        ------------------------- */}

        <div
          className={styles.footer}
        >
          <button
            onClick={onLogout}
            className={
              styles.logout
            }
            title={
              collapsed
                ? "Logout"
                : undefined
            }
          >
            <LogOut size={18} />

            {!collapsed && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}