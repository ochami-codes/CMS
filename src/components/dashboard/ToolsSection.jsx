// components/dashboard/ToolsSection.jsx

import { Link } from "react-router-dom";

import {
  Users,
  Wallet,
  Shield,
  Music,
  Baby,
  Church,
} from "lucide-react";

import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";

import styles from "../../styles/dashboard/ToolsSection.module.css";

const SHORTCUTS = [
  {
    title: "Treasury",
    path: "/dashboard/treasury",
    permission: "access_treasury_dashboard",
    icon: Wallet,
  },
  {
    title: "Youth",
    path: "/dashboard/youth",
    permission: "access_youth_dashboard",
    icon: Users,
  },
  {
    title: "Children",
    path: "/dashboard/children",
    permission: "access_children_dashboard",
    icon: Baby,
  },
  {
    title: "Choir",
    path: "/dashboard/choir",
    permission: "access_choir_dashboard",
    icon: Music,
  },
  {
    title: "Pastor",
    path: "/dashboard/pastor",
    permission: "access_pastor_dashboard",
    icon: Church,
  },
  {
    title: "Admin",
    path: "/dashboard/admin",
    permission: "access_admin_dashboard",
    icon: Shield,
  },
];

export default function ShortcutsSection({ canUser }) {

  const visible =
    SHORTCUTS.filter(s =>
      canUser(s.permission)
    );

  return (
    <section>

      <PageHeader
        level={3}
        title="Shortcuts"
        icon={<Users size={18} />}
      />

      {visible.length === 0 ? (
        <Card>
          <EmptyState
            title="No shortcuts available"
            description="You currently have no department access."
          />
        </Card>
      ) : (
        <div className={styles.wrapper}>

          <div className={styles.scroll}>

            {visible.map(s => {
              const Icon = s.icon;

              return (
                <Link
                  key={s.path}
                  to={s.path}
                  className={styles.link}
                >
                  <Card
                    clickable
                    className={styles.card}
                  >
                    <Icon size={22} />
                    <h4>{s.title}</h4>
                  </Card>
                </Link>
              );
            })}

          </div>

        </div>
      )}

    </section>
  );
}
