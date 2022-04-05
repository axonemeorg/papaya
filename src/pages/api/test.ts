import { dbConnection } from '@/database/connection'

export default (request, response) => {
    dbConnection.authenticate()
        .then(() => {
            response.json("Success!")
        })
}
