import { apiHandler } from "helpers/api"
import { getUserTransactions } from "store/slices/userIdSlice"

const users = require('data/users.json')

function apiHandler(req, res) {
    switch (req.method) {
        case 'GET':
            return getUsers()
        default:
            return res.status(405).end(`Method ${req.method} not allowed`)
    }
}

function getUsers() {
    const response = users.map(user => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    })
    return res.status(200).json(response)
}

export default apiHandler(handler)