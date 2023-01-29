import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface MicrobusAttr {
  full_direction_names: string;
  photo: string;
  work_time: string;
  from_coord: string;
  to_coord: string;
  total_busses: number;
  direction_distance: number;
  price: string;
  finish_time: string;
}

@Table({ tableName: 'microbus' })
export class Microbus extends Model<Microbus, MicrobusAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({ type: DataType.STRING })
  full_direction_names: string;
  @Column({ type: DataType.STRING })
  photo: string;
  @Column({ type: DataType.STRING })
  work_time: string;
  @Column({ type: DataType.STRING })
  from_coord: string;
  @Column({ type: DataType.STRING })
  to_coord: string;
  @Column({ type: DataType.INTEGER })
  total_busses: number;
  @Column({ type: DataType.INTEGER })
  direction_distance: number;
  @Column({ type: DataType.STRING })
  price: string;
  @Column({ type: DataType.STRING })
  finish_time: string;
}
