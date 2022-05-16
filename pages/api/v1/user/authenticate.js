import getConfig from 'next/config'
import { apiHandler } from 'helpers/api'
const jwt = require('jsonwebtoken')

const { serverRuntimeConfig } = getConfig()

const users = require('data/users.json')
// const users = require('data/users.json') 

export default function handler(req, res) {
    switch (req.method) {
        case 'POST':
            return authenticate()
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    function authenticate() {
        const { email, password } = req.body
        // console.log('email, password, users //', email, password, users);
        const user = users.find(u => u.email === email && u.password === password)
        // console.log(users[0].email, users[0].password)
        if (!user) throw new Error('Username or password is incorrect')
        const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '1h' })

        return res.status(200).json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            token
        })
    }
}