import { DataTypes, Model } from 'sequelize'
import connection from '..'

interface IUserModel {
    id: string
    name: string
    phoneNumber: string
    verified: boolean
    password: string
}

export default class User extends Model<IUserModel> {}

User.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: connection,
    tableName: 'users'
})
