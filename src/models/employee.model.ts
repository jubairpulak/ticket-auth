import { Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { EMPLOYEE_STATUS } from "src/constants/api.enums";
import { EmployeeOfficialInfoModel } from "./employee-official-info.model";
import { EmployeePersonalInfoModel } from "./employee-personal-info.model";

@Table({
  tableName: "employees",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
})
export class EmployeeModel extends Model<EmployeeModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM(...Object.values(EMPLOYEE_STATUS)),
    allowNull: false,
    defaultValue: EMPLOYEE_STATUS.ACTIVE,
  })
  status: EMPLOYEE_STATUS;

  @HasOne(() => EmployeeOfficialInfoModel)
  officialInfo: EmployeeOfficialInfoModel;

  @HasOne(() => EmployeePersonalInfoModel)
  personalInfo: EmployeePersonalInfoModel;

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
}
