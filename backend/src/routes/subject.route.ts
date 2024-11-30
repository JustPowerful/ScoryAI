import { Elysia, t } from "elysia";
import { authPlugin } from "../plugins/auth.plugin";
import { db } from "../db";
import { subjectTable } from "../db/schema";
import { eq } from "drizzle-orm";

const subjectRoute = new Elysia({
  prefix: "/subject",
});

subjectRoute
  .use(authPlugin)
  .post(
    "/create",
    async ({ body, set, user }) => {
      const { title } = body;
      try {
        const subject = await db
          .insert(subjectTable)
          .values({
            title,
            userId: user.id,
          })
          .returning();
        return {
          message: "Subject created successfully",
          subject: subject[0],
        };
      } catch (error) {
        set.status = 500;
        return {
          message: "Internal server error",
        };
      }
    },
    {
      body: t.Object({
        title: t.String(),
      }),
    }
  )
  .delete(
    "/delete/:id",
    async ({ params, set, user }) => {
      try {
        const { id } = params;
        const subject = await db
          .select()
          .from(subjectTable)
          .where(eq(subjectTable.id, id));
        if (subject.length === 0) {
          set.status = 404;
          return {
            message: "Subject not found",
          };
        }

        if (subject[0].userId !== user.id) {
          set.status = 403;
          return {
            message: "You are not authorized to delete this subject",
          };
        }

        await db.delete(subjectTable).where(eq(subjectTable.id, id));
      } catch (error) {}
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .get(
    "/paginate",
    async ({ query, set, user }) => {
      try {
        const { page = 1, limit = 5 } = query;
        const subjects = await db
          .select()
          .from(subjectTable)
          .where(eq(subjectTable.userId, user.id))
          .limit(limit)
          .offset((page - 1) * limit);
        return {
          message: "Successfully fetched subjects",
          subjects,
        };
      } catch (error) {}
    },
    {
      query: t.Object({
        page: t.Number(),
        limit: t.Number(),
      }),
    }
  );
