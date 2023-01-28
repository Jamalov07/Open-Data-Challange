import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface DriverAttrs {
  user_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  username: string;
  work_phone_number: string;
  car_model: string;
  car_number: string;
  car_color: string;
  car_photo: string;
  work_status: boolean;
  user_lang: string;
  last_lat: string;
  last_lon: string;
  last_state: string;
  car_year: string;
}

@Table({ tableName: 'driver' })
export class Driver extends Model<Driver, DriverAttrs> {
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
  work_phone_number: string;
  @Column({ type: DataType.STRING })
  car_model: string;
  @Column({ type: DataType.STRING })
  car_number: string;
  @Column({ type: DataType.STRING })
  car_color: string;
  @Column({ type: DataType.STRING })
  car_photo: string;
  @Column({ type: DataType.BOOLEAN })
  work_status: boolean;
  @Column({ type: DataType.STRING })
  last_lat: string;
  @Column({ type: DataType.STRING })
  last_lon: string;
  @Column({ type: DataType.STRING })
  user_lang: string;
  @Column({ type: DataType.STRING })
  last_state: string;
  @Column({ type: DataType.STRING })
  car_year: string;
}
