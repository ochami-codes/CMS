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

const TOOLS = [
  {
    title: "Treasury",
    path: "/dashboard/treasury",
    permission:
      "access_treasury_dashboard",

    icon: Wallet,
  },

  {
    title: "Youth",
    path: "/dashboard/youth",
    permission:
      "access_youth_dashboard",

    icon: Users,
  },

  {
    title: "Children",
    path: "/dashboard/children",
    permission:
      "access_children_dashboard",

    icon: Baby,
  },

  {
    title: "Choir",
    path: "/dashboard/choir",
    permission:
      "access_choir_dashboard",

    icon: Music,
  },

  {
    title: "Pastor",
    path: "/dashboard/pastor",
    permission:
      "access_pastor_dashboard",

    icon: Church,
  },

  {
    title: "Admin",
    path: "/dashboard/admin",
    permission:
      "access_admin_dashboard",

    icon: Shield,
  },
];

export default function ToolsSection({
  canUser,
}) {

  const visibleTools =
    TOOLS.filter(tool =>
      canUser(tool.permission)
    );

  return (
    <section>

      <PageHeader
        level={3}
        title="Tools"
        icon={<Users size={18} />}
      />

      {visibleTools.length === 0 ? (

        <Card>
          <EmptyState
            title="No tools available"
            description="You currently have no department access."
          />
        </Card>

      ) : (

        <div className={styles.grid}>

          {visibleTools.map(tool => {

            const Icon =
              tool.icon;

            return (

              <Link
                key={tool.path}
                to={tool.path}
                className={
                  styles.link
                }
              >

                <Card
                  clickable
                  className={
                    styles.card
                  }
                >

                  <Icon size={24} />

                  <h4>
                    {tool.title}
                  </h4>

                </Card>

              </Link>

            );
          })}

        </div>

      )}

    </section>
  );
}
