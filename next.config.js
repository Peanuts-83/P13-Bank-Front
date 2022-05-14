module.exports = {
    serverRuntimeConfig: {
        secret: 'MY_SECRET_PASS_PHRASE'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api/v1/user/'
            : `/api/v1/user`
    }
}