// components/dashboard/BirthdaySection.jsx

import { Gift } from "lucide-react";

export default function BirthdaySection({
  user,
  hasBirthday,
  isBirthday,
  birthdayTimer,
  todayBirthdays,
  upcomingBirthdays,
}) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <Gift size={18} />
        Birthday Corner
      </div>

      <div className="card">
        <div className="birthdays-grid">

          {/* MY BIRTHDAY */}

          <div className="birthday-card my-birthday-card">

            {hasBirthday ? (

              isBirthday ? (
                <>
                  🎉 Happy Birthday,{" "}
                  {user.full_name}! May
                  God's face shine on you!
                  🎉
                </>
              ) : birthdayTimer ? (
                <>
                  Your birthday is in:

                  <strong>
                    {" "}
                    {birthdayTimer.d}d{" "}
                    {birthdayTimer.h}h{" "}
                    {birthdayTimer.m}m{" "}
                    {birthdayTimer.s}s
                  </strong>

                  {" "}May God keep you
                  till then!
                </>
              ) : null

            ) : (
              <p>
                Your birthday is not set
                yet.
              </p>
            )}

          </div>

          {/* TODAY BIRTHDAYS */}

          {todayBirthdays.map((birthday) => (
            <div
              key={birthday.id}
              className="birthday-card birthday-today"
            >
              🎉 Let's celebrate{" "}
              {birthday.full_name},
              it's their birthday!
            </div>
          ))}

          {/* UPCOMING BIRTHDAYS */}

          {upcomingBirthdays.map((birthday) => (
            <div
              key={birthday.id}
              className="birthday-card birthday-upcoming"
            >
              {birthday.full_name}
              {" — "}
              {birthday.daysUntil} days
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
