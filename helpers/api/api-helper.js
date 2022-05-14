import { errorHandler, jwtMiddleware } from 'helpers/api'

export function apiHandler(handler) {
    return async(req, res) => {
        try {
            await jwtMiddleware(req, res)
            await handler(req, res)
        } catch (error) {
            errorHandler(error, res)
        }
    }
}