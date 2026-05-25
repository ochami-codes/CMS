import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import InboxList from "./InboxList";
import ChatWindow from "./ChatWindow";
import NewMessageModal from "./NewMessageModal";

import { MessagesAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

import styles from "../../styles/messages/MessagesPage.module.css";

export default function MessagesPage() {

  const { user } = useAuth();
  const currentProfileId = user?.id;

  const [activeThreadId, setActiveThreadId] =
    useState(null);

  const [activeRecipient, setActiveRecipient] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [inbox, setInbox] =
    useState([]);

  const [view, setView] =
    useState("inbox");


  const loadInbox = async () => {
    try {
      const res =
        await MessagesAPI.getInbox();

      setInbox(
        Array.isArray(res.inbox)
          ? res.inbox
          : []
      );

    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    loadInbox();
  }, []);


  const handleSelectThread =
    async (thread) => {

      setActiveThreadId(
        thread.thread_id
      );

      setActiveRecipient({
        id:
          thread.other_user_id,

        full_name:
          thread.other_user_name,
      });

      setView("chat");

      if (
        thread.unread_count > 0
      ) {

        setInbox(prev =>
          prev.map(item =>
            item.thread_id ===
            thread.thread_id
              ? {
                  ...item,
                  unread_count: 0,
                }
              : item
          )
        );

        try {
          await MessagesAPI.markAsRead(
            thread.thread_id
          );

        } catch {
          loadInbox();
        }
      }
    };


  return (

    <div className={styles.page}>

      {/* Inbox */}

      <AnimatePresence mode="wait">

        {view === "inbox" && (

          <motion.div
            className={
              styles.sidebar
            }

            initial={{
              opacity:0
            }}

            animate={{
              opacity:1
            }}

            exit={{
              opacity:0
            }}
          >

            <div
             className={
              styles.sidebarHeader
             }
            >

              <h3
               className={
                styles.title
               }
              >

                Message leaders and members

              </h3>

              <button
                className={`
                btn
                btn-primary
                ${styles.newBtn}
                `}
                onClick={()=>{
                  setActiveThreadId(null);
                  setActiveRecipient(null);
                  setShowModal(true);
                }}
              >

                + New

              </button>

            </div>


            <div
             className={
              styles.inbox
             }
            >

              <InboxList
                inbox={inbox}
                activeThreadId={
                  activeThreadId
                }

                onSelect={
                  handleSelectThread
                }
              />

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      {/* Chat */}

      <AnimatePresence mode="wait">

        {view === "chat" && (

          <motion.div
            className={
              styles.content
            }

            initial={{
              x:50,
              opacity:0
            }}

            animate={{
              x:0,
              opacity:1
            }}

            exit={{
              x:50,
              opacity:0
            }}
          >

            <ChatWindow
              threadId={
                activeThreadId
              }

              recipient={
                activeRecipient
              }

              onThreadCreated={
                setActiveThreadId
              }

              onMessageSent={
                loadInbox
              }

              onBack={()=>
                setView("inbox")
              }

            />

          </motion.div>

        )}

      </AnimatePresence>



      {/* Modal */}

      {showModal && (

        <div
         className={
          styles.modalOverlay
         }
        >

          <NewMessageModal
            onClose={() =>
              setShowModal(false)
            }

            onSelect={
              async(user)=>{

                const res =
                 await MessagesAPI
                 .getThreadWith(
                   user.id
                 );

                setActiveRecipient(
                  user
                );

                setActiveThreadId(
                  res.thread_id || null
                );

                setView("chat");
                setShowModal(false);
              }
            }

          />

        </div>

      )}

    </div>

  );
}
