import { Table, Column, Model, DataType, HasOne, HasMany } from 'sequelize-typescript';
import { MembersModel } from './member.model';
import { ProfileBankInformationsModel } from './ProfileBankInformation.model';

//@Table({ tableName: 'profiles', timestamps: true })
@Table({ tableName: 'profiles'})
export class ProfilesModel extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  driver_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bn_name: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobile: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  tin_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  nationality: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  nid_no: string;


  @Column({
    type: DataType.DATE,
    //defaultValue: DataType.NOW, // discuss with Jubair
    allowNull: true
  })
  dob: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({ // https://s3.ap-south-1.amazonaws.com/cdn-shebadev/images/profiles/pro_pic_1552910734_pro_pic_image_1.png
    type: DataType.STRING,
    allowNull: true
  })
  pro_pic: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false
  })
  created_by: number; // Profiles table primary key
  
  @Column({
    type: DataType.STRING,
    allowNull: false
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

    // Relationships
    @HasMany(() => MembersModel, { foreignKey: 'profile_id', as: 'member' })
    member: MembersModel[];

    @HasOne(() => ProfileBankInformationsModel, { foreignKey: 'profile_id', as: 'bank_info' })
    bank_info: ProfileBankInformationsModel;
}