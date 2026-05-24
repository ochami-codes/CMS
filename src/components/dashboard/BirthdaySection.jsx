// components/dashboard/BirthdaySection.jsx
import { Gift } from "lucide-react";

import Card from "../Card";
import StatCard from "../StatCard";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";

import styles from "../../styles/dashboard/BirthdaySection.module.css";

export default function BirthdaySection({

  user,

  hasBirthday,
  isBirthday,
  birthdayTimer,

  todayBirthdays=[],
  upcomingBirthdays=[],

}) {

return(

<section className={styles.section}>

<PageHeader
level={3}
title="Birthday Corner"
icon={<Gift size={18}/>}
/>


<div className={styles.grid}>


{/* MY BIRTHDAY */}

<Card>

{hasBirthday ? (

isBirthday ? (

<div className={styles.birthday}>

  <div className={styles.birthdayTitle}>
    🎉 Happy Birthday,
    <span className={styles.name}>
      {" "}{user.full_name}
    </span>
  </div>

  <p className={styles.birthdayNote}>
    May God's blessings be with you today.
  </p>

</div>

)

: birthdayTimer ? (

<div className={styles.birthday}>

<p>
Your birthday is in:
</p>

<div className={styles.timer}>
  <span>{birthdayTimer.d}d</span>
  <span>{birthdayTimer.h}h</span>
  <span>{birthdayTimer.m}m</span>
  <span>{birthdayTimer.s}s</span>
</div>

</div>

)

: null

)

:

<EmptyState
title="Birthday missing"
message="Set your birthday in profile."
/>

}

</Card>



{/* TODAY */}

{todayBirthdays.map(person => (

<Card key={person.id}>

<div className={styles.today}>

<span className={styles.emoji}>
🎂
</span>

<div className={styles.message}>
Celebrate
<strong className={styles.name}>
{person.full_name}
</strong>
today!
</div>

</div>

</Card>

))}
</div>
</section>
)}
