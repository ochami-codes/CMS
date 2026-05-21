import { useNavigate } from "react-router-dom";
import { FaChurch, FaPlus, FaSearch } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import Loader from "../components/Loader";
import Card from "../components/Card";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";

import styles from "../styles/pages/Onboarding.module.css";

export default function Onboarding() {
  const { user, switchChurch } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Loader />;

  const memberships = user.memberships || [];

  const active =
    memberships.filter(
      m => m.status === "active"
    );

  const pending =
    memberships.filter(
      m => m.status !== "active"
    );


  async function handleOpenChurch(churchId){
    const success =
      await switchChurch(churchId);

    if(success){
      navigate("/dashboard");
    }
  }

  return (

    <div className={styles.container}>

      <PageHeader
        title={`Welcome back,
        ${user.full_name || "User"} 👋`}
        subtitle="Choose how you'd like to continue"
      />



      {active.length > 0 && (

        <section>

          <h2 className={styles.title}>
            Your Churches
          </h2>

          <div className={styles.grid}>

            {active.map(m => (

              <Card
                key={m.id}
                className={styles.churchCard}
              >

                <FaChurch />

                <h3>
                  {m.church_name}
                </h3>

                <Button
                  onClick={() =>
                    handleOpenChurch(
                      m.church_id
                    )
                  }
                >
                  Open Church
                </Button>

              </Card>

            ))}

          </div>

        </section>

      )}



      {pending.length > 0 && (

        <section>

          <h2 className={styles.title}>
            Pending Requests
          </h2>

          <div className={styles.grid}>

            {pending.map(m => (

              <Card key={m.id}>

                <h3>
                  {m.church_name}
                </h3>

                <p>
                  Status:
                  {" "}
                  {m.status}
                </p>

              </Card>

            ))}

          </div>

        </section>

      )}



      {memberships.length === 0 && (

        <Card>

          <h3>
            No church memberships
          </h3>

          <p>
            Join a church or
            create one.
          </p>

        </Card>

      )}



      <div className={styles.actions}>

        <Card>

          <FaSearch />

          <h3>
            Join Church
          </h3>

          <p>
            Request access to
            an existing church.
          </p>

          <Button
            onClick={() =>
              navigate("/join-church")
            }
          >
            Join Church
          </Button>

        </Card>



        <Card>

          <FaPlus />

          <h3>
            Create Church
          </h3>

          <p>
            Start a new church
            workspace.
          </p>

          <Button
            variant="outline"
            onClick={() =>
              navigate(
                "/create-church"
              )
            }
          >
            Create Church
          </Button>

        </Card>

      </div>

    </div>
  );
}
