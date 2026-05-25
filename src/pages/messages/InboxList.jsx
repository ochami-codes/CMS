import styles from  "../../styles/messages/InboxList.module.css";

export default function InboxList({
 inbox=[],
 onSelect,
 activeThreadId,
}) {

const formatTime=(date)=>{
 const d=new Date(date);
 const now=new Date();

 if(
  d.toDateString()===
  now.toDateString()
 ){

 return d.toLocaleTimeString(
 [],
 {
  hour:"2-digit",
  minute:"2-digit"
 });

 }

 return d.toLocaleDateString();
};


return(

<div className={styles.list}>

{inbox.length===0 ? (

<div className={styles.empty}>
 No conversations yet
</div>

):(

 inbox.map(thread=>{

 const isActive =
 activeThreadId ===
 thread.thread_id;

 const isUnread =
 thread.unread_count > 0;


 return(

<div

 key={thread.thread_id}

 onClick={()=>
   onSelect(thread)
 }

 className={`
 ${styles.thread}

 ${isActive
   ? styles.active
   : ""
 }
 `}
>

<div className={styles.avatar}>

{thread.other_user_name
 ?.charAt(0)
 ?.toUpperCase()
 || "U"}

</div>


<div className={styles.body}>

<div className={styles.top}>

<span className={styles.name}>

{thread.other_user_name
 || "Unknown"}

</span>


<span className={styles.time}>

{thread.last_message_at &&
 formatTime(
  thread.last_message_at
 )}

</span>

</div>


<p className={styles.preview}>

{thread.last_message
 ?.length > 60

 ? thread.last_message
   .slice(0,60)+"..."

 : thread.last_message
 || "No content"}

</p>


{isUnread && (

<span className={styles.badge}>

{thread.unread_count}

</span>

)}

</div>

</div>

);

})

)}

</div>

);

}
