import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { BusinessDepartmentsModel } from './business-department.model';
import { BusinessMembersModel } from './business-member.model';
// @Table({ tableName: 'business_roles', timestamps: true })
@Table({ tableName: 'business_roles' })
export class BusinessRolesModel extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => BusinessDepartmentsModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  business_department_id: number;// Primary key of business_departments table

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({ // value is 0 active 1 inactive
    type: DataType.INTEGER,
    allowNull: true
  })
  is_published: number;
  
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: true
  })
  created_by: number; // Profiles table primary key
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: "admin"
  })
  created_by_name: string; // Profiles table name

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: true
  })
  updated_by: number; // Profiles table primary key
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: "admin"
  })
  updated_by_name: string; // Profiles table name

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    //defaultValue: DataType.NOW,
    allowNull: true
  })
  updated_at: Date;

  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  // })
  // deletedAt: Date;

  //Relation
  @BelongsTo(() => BusinessDepartmentsModel)
  department: BusinessDepartmentsModel;

  @HasMany(() => BusinessMembersModel)
  businessMembers: BusinessMembersModel[];
}