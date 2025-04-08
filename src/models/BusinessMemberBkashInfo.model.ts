import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { BusinessMembersModel } from './business-member.model';

// @Table({ tableName: 'business_member_bkash_info', timestamps: true })
@Table({ tableName: 'business_member_bkash_info' })
export class BusinessMemberBkashInfoModel extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => BusinessMembersModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  business_member_id: number; // Primary key of business_member table

  @Column({ 
    type: DataType.STRING,
    allowNull: true
  })
  account_no: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false
  })
  created_by: number; // members table primary key
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  created_by_name: string; // Profiles table name

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    //allowNull: false
    allowNull: true
  })
  updated_by: number; // members table primary key
  
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  updated_by_name: string; // Profiles table name

  @Column({
    type: DataType.DATE,
    //defaultValue: DataType.NOW,
    allowNull: false
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    //defaultValue: DataType.NOW,
    allowNull: true // maybe allowNull: true
  })
  updated_at: Date;

  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  // })
  // deletedAt: Date;

  // Relation
  @BelongsTo(() => BusinessMembersModel)
  business_member: BusinessMembersModel;
}