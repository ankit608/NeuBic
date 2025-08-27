import { Sequelize } from "sequelize";

let _sequelize: Sequelize | null = null;

export async function getSequelize() {
  if (_sequelize) return _sequelize;

  const isProd = process.env.NODE_ENV === "production";

  _sequelize = new Sequelize(process.env.DATABASE_URL || "", {
    dialect: "postgres",
    dialectModule: require("pg"),  // 👈 force Sequelize to use pg
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });

  try {
    await _sequelize.authenticate();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB connection failed", err);
  }

  return _sequelize;
}
