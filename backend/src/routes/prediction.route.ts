import { Elysia, t } from "elysia";
import { authPlugin } from "../plugins/auth.plugin";
import { db } from "../db";
import { predictionTable, subjectTable, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { fetch } from "bun";

const predictionRoute = new Elysia({
  prefix: "/prediction",
});

predictionRoute
  .use(authPlugin)
  .post(
    "/create",
    async ({ body, set, user }) => {
      try {
        const {
          subjectId,
          hoursStudied,
          attendance,
          tutoringSessions,
          accessToRessource,
        } = body;
        const currentUser = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, user.id));
        if (currentUser.length === 0) {
          set.status = 404;
          return {
            message: "User not found",
          };
        }

        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Hours_studied: hoursStudied,
            Attendance: attendance,
            Parental_Involvement: currentUser[0].parental_involvment ? 1 : 0,
            Access_to_Ressource: accessToRessource ? 1 : 0,
            Distance_from_Home: Number(currentUser[0].distance_from_home),
            Sleep_Hours: Number(currentUser[0].sleep_hours),
            Motivation_Level: Number(currentUser[0].motivation_level),
            Internet_Access: Number(currentUser[0].internet_access ? 1 : 0),
            Tutoring_Sessions: Number(tutoringSessions),
            School_Type: Number(currentUser[0].school_type),
            Learning_Disabilities: Number(
              currentUser[0].learning_disability ? 1 : 0
            ),
            Gender: Number(currentUser[0].gender),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to get prediction");
        }

        const result = await db
          .insert(predictionTable)
          .values({
            subject_id: subjectId.toString(),
            hours_studied: hoursStudied.toString(),
            attendance: attendance.toString(),
            tutoring_sessions: tutoringSessions.toString(),
            access_to_ressource: accessToRessource.toString(),
            predicted_score: data.prediction,
          })
          .returning();

        return {
          message: "Prediction created",
          prediction: result[0],
        };
      } catch (error) {
        console.log(error);
      }
    },
    {
      body: t.Object({
        subjectId: t.String(),
        hoursStudied: t.Number(),
        attendance: t.Number(),
        tutoringSessions: t.Number(),
        accessToRessource: t.Number(),
      }),
    }
  )
  .delete("/delete/:id", async ({ params, set }) => {
    try {
      const result = await db
        .delete(predictionTable)
        .where(eq(predictionTable.id, params.id))
        .returning();

      if (result.length === 0) {
        set.status = 404;
        return {
          message: "Prediction not found",
        };
      }

      return {
        message: "Prediction deleted",
      };
    } catch (error) {
      console.log(error);
    }
  })
  .get(
    "/getall/:subjectId",
    async ({ set, user, params: { subjectId } }) => {
      try {
        const subject = await db
          .select()
          .from(subjectTable)
          .where(eq(subjectTable.id, subjectId));

        if (subject.length === 0) {
          set.status = 404;
          return {
            message: "Subject not found",
          };
        }

        if (subject[0].userId !== user.id) {
          set.status = 403;
          return {
            message: "Forbidden",
          };
        }

        const results = await db
          .select()
          .from(predictionTable)
          .where(eq(predictionTable.subject_id, subjectId));

        return {
          message: "All predictions fetched",
          predictions: results,
        };
      } catch (error) {
        console.log(error);
      }
    },
    {
      params: t.Object({
        subjectId: t.String(),
      }),
    }
  );

export default predictionRoute;
