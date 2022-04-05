import { Sequelize } from 'sequelize'

const connectionUri: string = `postgres://${
        process.env.DB_USER
    }:${
        process.env.DB_PASS
    }@${
        process.env.DB_HOST
    }:${
        process.env.DB_PORT
    }/${
        process.env.DB_NAME
}`

export const dbConnection = new Sequelize(connectionUri)

