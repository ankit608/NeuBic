export const runtime = "nodejs";  // <-- important for Sequelize

import { NextResponse } from "next/server";
import { getSequelize } from "@/lib/db";
import { initModels } from "@/models";

export async function GET() {
  const sequelize = await getSequelize();
  const { User, Project } = await initModels();
   console.log("heloooo...")
  // Sync in dev only
  await sequelize.sync({ alter: true });

  const user = await User.create({ email: "john@example.com", name: "John Doe" });
  await Project.create({ name: "My First Project", userId: user.id });

  const withProjects = await User.findByPk(user.id, { include: "projects" });

  return NextResponse.json(withProjects);
}
