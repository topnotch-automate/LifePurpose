// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlTag = (strings: TemplateStringsArray, ...values: any[]) => Promise<any>;

function isInvalidConnectionStringError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("invalid_connection_string") ||
      error.name === "VercelPostgresError")
  );
}

/**
 * Serverless-safe Postgres client.
 * Uses a pooled connection when available; falls back to a direct client.
 */
export async function createPostgresSql(): Promise<SqlTag | null> {
  const hasAnyPostgresEnv =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!hasAnyPostgresEnv) {
    return null;
  }

  try {
    const postgresModule = (await import("@vercel/postgres")) as unknown as {
      createPool: (config?: { connectionString?: string }) => {
        sql: SqlTag;
      };
      createClient: (config?: { connectionString?: string }) => {
        sql: SqlTag;
        connect: () => Promise<void>;
      };
      postgresConnectionString?: (type?: "pool" | "direct") => string | undefined;
    };

    const poolCandidates = [
      postgresModule.postgresConnectionString?.("pool"),
      process.env.POSTGRES_PRISMA_URL?.trim(),
      process.env.POSTGRES_URL?.trim(),
    ].filter((value, index, array): value is string => {
      return Boolean(value) && array.indexOf(value) === index;
    });

    for (const connectionString of poolCandidates) {
      try {
        const pool = postgresModule.createPool({ connectionString });
        await pool.sql`SELECT 1`;
        return pool.sql.bind(pool);
      } catch (error) {
        if (!isInvalidConnectionStringError(error)) {
          console.warn("createPostgresSql: pooled connection failed:", error);
        }
      }
    }

    const directCandidates = [
      postgresModule.postgresConnectionString?.("direct"),
      process.env.POSTGRES_URL_NON_POOLING?.trim(),
    ].filter((value, index, array): value is string => {
      return Boolean(value) && array.indexOf(value) === index;
    });

    for (const connectionString of directCandidates) {
      try {
        const client = postgresModule.createClient({ connectionString });
        await client.connect();
        await client.sql`SELECT 1`;
        return client.sql.bind(client);
      } catch (error) {
        console.warn("createPostgresSql: direct connection failed:", error);
      }
    }

    return null;
  } catch (error) {
    console.warn("createPostgresSql: could not initialize Postgres client:", error);
    return null;
  }
}
