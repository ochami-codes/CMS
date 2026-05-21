// components/dashboard/DashboardHeader.jsx

import { Home } from "lucide-react";

import Card from "../Card";

import styles from "../../styles/dashboard/DashboardHeader.module.css";

export default function DashboardHeader({

  churchName,
  greeting,
  verse,

}) {

return(

<section>

<Card>

<div className={styles.top}>

<div className={styles.title}>

<Home size={20}/>

<h2>
{churchName}
</h2>

</div>

<p className={styles.greeting}>
{greeting}
</p>

</div>


{verse && (

<blockquote
className={styles.verse}
>

<p>
"{verse.text}"
</p>

<footer>

— {verse.reference}

</footer>

</blockquote>

)}

</Card>

</section>

)

}
