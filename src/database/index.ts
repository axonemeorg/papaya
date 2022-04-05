import { Sequelize } from 'sequelize'

const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './zisk.sqlite'
})

export default connection
