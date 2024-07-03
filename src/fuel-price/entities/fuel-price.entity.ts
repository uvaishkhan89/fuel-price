import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class FuelPrice extends Model<FuelPrice> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    })
    id: number;

    @Column(DataType.STRING)
    state: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    petrolPrice: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    dieselPrice: string;
}