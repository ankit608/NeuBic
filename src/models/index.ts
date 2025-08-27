import { getSequelize } from "@/lib/db";
import { initUser, User } from "./user";
import { initProject, Project } from "./project";

let initialized = false;

export async function initModels() {
  if (initialized) return { User, Project };

  const sequelize = await getSequelize();

  initUser(sequelize);
  initProject(sequelize);

  // Associations
  User.hasMany(Project, { foreignKey: "userId", as: "projects" });
  Project.belongsTo(User, { foreignKey: "userId", as: "user" });

  initialized = true;
  return { User, Project };
}
