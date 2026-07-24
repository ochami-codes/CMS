import { Gift, Cake, PartyPopper } from "lucide-react";
import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import styles from "../../styles/dashboard/BirthdaySection.module.css";

export default function BirthdaySection({
  user,
  hasBirthday,
  isBirthday,
  birthdayTimer,
  todayBirthdays = [],
  upcomingBirthdays = [],
}) {
  return (
    <section className={styles.section}>
      <PageHeader level={3} title="Birthday Corner" icon={<Gift size={18} />} />

      <div className={styles.grid}>
        
        {/* My Birthday */}
        <Card className={`${styles.myBirthday} ${isBirthday ? styles.isToday : ""}`}>
          {hasBirthday ? (
            isBirthday ? (
              <div className={styles.celebration}>
                <PartyPopper size={32} className={styles.celebrateIcon} />
                <div>
                  <h4>Happy Birthday, {user.full_name}! 🎉</h4>
                  <p>May God's blessings be with you today.</p>
                </div>
              </div>
            ) : birthdayTimer ? (
              <div className={styles.countdown}>
                <Cake size={28} className={styles.cakeIcon} />
                <div>
                  <p>Your birthday is in</p>
                  <div className={styles.timer}>
                    <div><strong>{birthdayTimer.d}</strong><span>Days</span></div>
                    <div><strong>{birthdayTimer.h}</strong><span>Hrs</span></div>
                    <div><strong>{birthdayTimer.m}</strong><span>Min</span></div>
                    <div><strong>{birthdayTimer.s}</strong><span>Sec</span></div>
                  </div>
                </div>
              </div>
            ) : null
          ) : (
            <EmptyState
              title="Birthday missing"
              message="Add your birthday in profile to celebrate with us."
            />
          )}
        </Card>

        {/* Today's Birthdays */}
        {todayBirthdays.map(person => (
          <Card key={person.id} className={styles.todayCard}>
            <div className={styles.avatar}>
              {person.full_name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.todayContent}>
              <p>
                Celebrate <strong>{person.full_name}</strong>, it's their birthday!
              </p>
            </div>
          </Card>
        ))}

        {todayBirthdays.length === 0 && hasBirthday && !isBirthday && (
          <Card className={styles.emptyCard}>
            <EmptyState
              title="No birthdays today"
              message="Check back tomorrow for celebrations."
            />
          </Card>
        )}
      </div>
    </section>
  );
}
