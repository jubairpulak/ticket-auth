import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import {
  PURPOSE,
  ACCOUNT_TYPE
} from '../constants/api.enums';
import { ProfilesModel } from './profile.model';

// @Table({ tableName: 'profile_bank_informations', timestamps: true })
@Table({ tableName: 'profile_bank_informations' })
export class ProfileBankInformationsModel extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => ProfilesModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  profile_id: number;// Primary key of profiles table

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  purpose: PURPOSE;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  bank_name: string;

  @Column({ 
    type: DataType.STRING,
    allowNull: true
  })
  account_no: string;

  @Column({ 
    type: DataType.STRING,
    allowNull: true
  })
  account_type: ACCOUNT_TYPE;

  @Column({ 
    type: DataType.STRING,
    allowNull: true
  })
  branch_name: string;

  @Column({ 
    type: DataType.STRING,
    allowNull: true
  })
  routing_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  cheque_book_receipt: string;

  @Column({ 
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at: Date;

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

  // Relationship
  @BelongsTo(() => ProfilesModel, { foreignKey: 'profile_id', as: 'profile' })
  profile: ProfilesModel;
}