import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL?.trim();
const seedEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
const seedPassword = process.env.ADMIN_SEED_PASSWORD?.trim();
const seedRole = process.env.ADMIN_SEED_ROLE?.trim().toLowerCase() === "operator" ? "operator" : "admin";

if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

if (!seedEmail) {
  throw new Error("Missing ADMIN_SEED_EMAIL");
}

if (!seedPassword) {
  throw new Error("Missing ADMIN_SEED_PASSWORD");
}

const sql = postgres(connectionString, { prepare: false });

try {
  const passwordHash = await bcrypt.hash(seedPassword, 12);
  const id = `ADM-${seedEmail}`;

  await sql`
    insert into admin_users (id, email, password_hash, role, active)
    values (${id}, ${seedEmail}, ${passwordHash}, ${seedRole}, true)
    on conflict (email)
    do update set
      password_hash = excluded.password_hash,
      role = excluded.role,
      active = true
  `;

  console.log(`Admin user upserted: ${seedEmail} (${seedRole})`);
} finally {
  await sql.end();
}
