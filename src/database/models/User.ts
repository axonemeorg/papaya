import { DataTypes, Model, ModelAttributes } from 'sequelize'

import connection from '@/database'

interface IUserModel {
    id: string
    name: string
    phoneNumber: string
    verified: boolean
    password: string
}

export default class User extends Model<IUserModel> {}

export const config: ModelAttributes<User, IUserModel> = {
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
}

export const tableName: string = 'users'

User.init(config, { sequelize: connection, tableName })
