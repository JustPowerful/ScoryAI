import { Elysia, t } from "elysia";
import { authPlugin } from "../plugins/auth.plugin";
import { db } from "../db";
import { subjectTable } from "../db/schema";
import { and, count, eq, ilike } from "drizzle-orm";

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
        const { page = 1, limit = 5, search = "" } = query;
        const subjects = await db
          .select()
          .from(subjectTable)
          .where(
            and(
              eq(subjectTable.userId, user.id),
              ilike(subjectTable.title, `%${search}%`)
            )
          )
          .limit(limit)
          .offset((page - 1) * limit);

        const totalSubjects = await db
          .select({ count: count() })
          .from(subjectTable)
          .where(eq(subjectTable.userId, user.id));
        const totalCount = totalSubjects[0].count;
        const totalPages = Math.ceil(totalCount / limit);

        return {
          message: "Successfully fetched subjects",
          totalPages,
          subjects,
        };
      } catch (error) {
        set.status = 500;
        return {
          message: "Internal server error",
        };
      }
    },
    {
      query: t.Object({
        page: t.Number(),
        limit: t.Number(),
        search: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:id",
    async ({ set, params, user }) => {
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
            message: "You are not authorized to view this subject",
          };
        }
        return {
          message: "Successfully fetched subject",
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
      params: t.Object({
        id: t.String(),
      }),
    }
  );

export default subjectRoute;
