import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserAttrs {
  user_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  username: string;
  status: boolean;
  last_state: string;
  user_lang: string;
  ads_phone_number: string;
  real_name: string;
  message_id: number;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttrs> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  user_id: string;
  @Column({ type: DataType.STRING })
  phone_number: string;
  @Column({ type: DataType.STRING })
  first_name: string;
  @Column({ type: DataType.STRING })
  last_name: string;
  @Column({ type: DataType.STRING })
  username: string;
  @Column({ type: DataType.STRING })
  last_state: string;
  @Column({ type: DataType.STRING })
  user_lang: string;
  @Column({ type: DataType.STRING })
  ads_phone_number: string;
  @Column({ type: DataType.STRING })
  real_name: string;
  @Column({ type: DataType.INTEGER })
  message_id: number;
  @Column({ type: DataType.BOOLEAN })
  status: boolean;
}
