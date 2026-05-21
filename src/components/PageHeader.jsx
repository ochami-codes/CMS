import styles from "../styles/components/PageHeader.module.css";

export default function PageHeader({
 title,
 actions
}){

 return(

 <div className={styles.header}>

   <h1>{title}</h1>

   <div>
      {actions}
   </div>

 </div>

 )
}
