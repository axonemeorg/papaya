import connection from '@/database'

export default (request, response) => {
    connection.authenticate()
        .then(() => {
            response.json("Success!")
        })
}
