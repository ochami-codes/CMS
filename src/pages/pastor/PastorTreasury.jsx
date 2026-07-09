import {
  HandCoins,
  Landmark,
  Wallet,
  PiggyBank,
} from "lucide-react";

import StatCard from "../../components/StatCard";

import styles from "../../styles/pages/PastorTreasury.module.css";

export default function PastorTreasury({
  treasury = {},
  isFetching,
}) {
  const cards = [
    {
      title: "Total Giving",
      value: `KES ${Number(
        treasury.totalGiving ?? 0
      ).toLocaleString()}`,
      icon: <HandCoins size={22} />,
    },
    {
      title: "Total Tithe",
      value: `KES ${Number(
        treasury.totalTithe ?? 0
      ).toLocaleString()}`,
      icon: <Landmark size={22} />,
    },
    {
      title: "Local Funds",
      value: `KES ${Number(
        treasury.localFunds ?? 0
      ).toLocaleString()}`,
      icon: <Wallet size={22} />,
    },
    {
      title: "Trust Funds",
      value: `KES ${Number(
        treasury.trustFunds ?? 0
      ).toLocaleString()}`,
      icon: <PiggyBank size={22} />,
    },
  ];

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Treasury Overview
          </h2>

          <p className={styles.subtitle}>
            Read-only summary of the church's
            financial position.
          </p>
        </div>

        {isFetching && (
          <span className={styles.refreshing}>
            Updating...
          </span>
        )}
      </header>

      <div className={styles.grid}>
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </section>
  );
}