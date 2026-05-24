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

<p>

🎉 Happy Birthday,
<strong>
 {user.full_name}
</strong>

May God's blessings
be with you today.

</p>

)

: birthdayTimer ? (

<p>
  Your birthday in

  <strong className={styles.timer}>
    <span>{birthdayTimer.d}d</span>
    <span>{birthdayTimer.h}h</span>
    <span>{birthdayTimer.m}m</span>
    <span>{birthdayTimer.s}s</span>
  </strong>
</p>

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

{todayBirthdays.map(person=>(

<Card key={person.id}>

🎉 Celebrate
<strong>
{" "}
{person.full_name}
</strong>

today!

</Card>

))}



{/* UPCOMING */}

{upcomingBirthdays.map(person=>(

<StatCard

key={person.id}

title={person.full_name}

value={`${person.daysUntil} days`}

icon={<Gift size={18}/>}

/>

))}


</div>

</section>

)

}
