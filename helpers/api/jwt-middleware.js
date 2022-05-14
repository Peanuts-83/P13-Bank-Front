const expressJwt = require('express-jwt')
const util = require('util')
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

export function jwtMiddleware(req, res) {
    const middleware = expressJwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
        // public routes that don't require authentication
        path: ['/', '/Signin', 'Signup', '/api/users/authenticate']
    })
    return util.promisify(middleware)(req, res)
}
