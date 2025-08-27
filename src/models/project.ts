import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
  } from "sequelize";
  
  export class Project extends Model<
    InferAttributes<Project>,
    InferCreationAttributes<Project>
  > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string | null;
    declare userId: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  export function initProject(sequelize: Sequelize) {
    Project.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { sequelize, tableName: "projects" }
    );
  
    return Project;
  }
  