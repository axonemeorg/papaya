import { Sequelize, QueryInterface } from 'sequelize'

import { config, tableName } from '@/database/models/User'

export const up = async (queryInterface: QueryInterface, sequelize: Sequelize) => {
	await queryInterface.createTable(tableName, config);
}

export const down = async (queryInterface: QueryInterface, sequelize: Sequelize) => {
	await queryInterface.dropTable(tableName)
}
