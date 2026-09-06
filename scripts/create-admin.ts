import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";

const [email, password, name = "LumaYard Owner"] = process.argv.slice(2);
if (!email || !password || password.length < 12) {
  console.error("Usage: npm run admin:create -- owner@example.com 'password-at-least-12-chars' 'Display Name'");
  process.exit(1);
}

async function main() {
  const passwordHash = await hash(password, 12);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, name, role: "OWNER", status: "ACTIVE" },
    create: { email: email.toLowerCase(), passwordHash, name, role: "OWNER" },
  });
  console.log(`Owner account ready: ${email.toLowerCase()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
