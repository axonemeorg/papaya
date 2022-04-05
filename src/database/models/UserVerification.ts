import { DataTypes, Model } from 'sequelize'
import connection from '..'

interface IUserVerificationModel {
    phoneNumber: string
    expiresAt: Date
    verificationCode: string
    verified: boolean
}

export default class UserVerification extends Model<IUserVerificationModel> {}

UserVerification.init({
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    verificationCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: connection,
    tableName: 'user_verifications'
})
