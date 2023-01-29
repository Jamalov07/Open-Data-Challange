import { Column, DataType, Model, Table } from "sequelize-typescript";

interface AddressAttr {
  request_id: number;
  coordinate_lat: number;
  coordinate_lon: number;
  address_name: string;
  address_text: string;
  bounded_top_lat: number;
  bounded_top_lon: number;
  bounded_bottom_lat: number;
  bounded_bottom_lon: number;
  full_text: string;
}

@Table({ tableName: "address" })
export class Address extends Model<Address, AddressAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({ type: DataType.INTEGER })
  request_id: number;
  @Column({ type: DataType.DOUBLE })
  coordinate_lat: number;
  @Column({ type: DataType.DOUBLE })
  coordinate_lon: number;
  @Column({ type: DataType.STRING })
  address_name: string;
  @Column({ type: DataType.STRING })
  address_text: string;
  @Column({ type: DataType.DOUBLE })
  bounded_top_lat: number;
  @Column({ type: DataType.DOUBLE })
  bunded_top_lon: number;
  @Column({ type: DataType.DOUBLE })
  bounded_bottom_lat: number;
  @Column({ type: DataType.DOUBLE })
  bounded_bottom_lon: number;
  @Column({ type: DataType.STRING(1000) })
  full_text: string;
}
