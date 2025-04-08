import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { BusinessRolesModel } from './business-role.model';

// @Table({ tableName: 'business_departments', timestamps: true })
@Table({ tableName: 'business_departments' })
export class BusinessDepartmentsModel extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ // Primary key of businesses table
    type: DataType.INTEGER,
    allowNull: false
  })
  business_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  abbreviation: string;

  @Column({ 
    type: DataType.STRING,
    allowNull: true
  })
  logo: string;

  @Column({ 
    type: DataType.STRING,
    allowNull: true
  })
  icon: string;

  @Column({ // value is 0 active 1 inactive
    type: DataType.INTEGER,
    allowNull: false
  })
  is_published: number;
  
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false
  })
  created_by: number; // Profiles table primary key
  
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  created_by_name: string; // Profiles table name

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false
    //allowNull: true
  })
  updated_by: number; // Profiles table primary key
  
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  updated_by_name: string; // Profiles table name

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
 
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: true // maybe allowNull: true
  })
  updated_at: Date;

  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  // })
  // deletedAt: Date;

  // Relation
  @HasMany(() => BusinessRolesModel)
  roles: BusinessRolesModel[];
}