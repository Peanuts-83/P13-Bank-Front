
export async function getUserProfile(serviceData) {
    try {
        const jwtToken = serviceData.headers.authorization.split('Bearer')[1].trim()
        const decodedJwtToken = jwt.decode(jwtToken)
        const user = await User.findOne({ _id: decodedJwtToken.id })

        if (!user) {
          throw new Error('User not found!')
        }

        return user.toObject()
      } catch (error) {
        console.error('Error in userService.js', error)
        throw new Error(error)
      }
}