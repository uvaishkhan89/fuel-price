import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class State extends Model<State> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    })
    id: number;

    @Column(DataType.STRING)
    name: string;
}