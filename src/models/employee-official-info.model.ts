import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import { DepartmentModel } from "./department.model";
import { EmployeeModel } from "./employee.model";
import { SubDepartmentModel } from "./sub-department.model";

@Table({
  tableName: "employee_official_info",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
})
export class EmployeeOfficialInfoModel extends Model<EmployeeOfficialInfoModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  employee_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  email: string;

  @ForeignKey(() => DepartmentModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  department_id: number;

  @ForeignKey(() => SubDepartmentModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  sub_department_id: number;

  @ForeignKey(() => EmployeeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  line_manager: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date_of_joining: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  employee_type: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  giver_employee_id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  grade: string;

  @BelongsTo(() => EmployeeModel, {
    foreignKey: "employee_id",
    targetKey: "id",
    as: "employee_info",
  })
  employee: EmployeeModel;

  @BelongsTo(() => DepartmentModel)
  department: DepartmentModel;

  @BelongsTo(() => SubDepartmentModel)
  sub_department: SubDepartmentModel;

  @BelongsTo(() => EmployeeModel, {
    foreignKey: "line_manager",
    targetKey: "id",
    as: "line_manager_info",
  })
  line_manager_info: EmployeeModel;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  designation: string;
}
