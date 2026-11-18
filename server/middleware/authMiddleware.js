import JWT from 'jsonwebtoken'
const JWT_SECRET = 'hihihihihihihihihihihihihihihihi' 
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader){
        return res.status(401).json({
            error: 'Authorization token is missing'
        })
    }
    const token = authHeader.split(' ')[1]
    try{
        const decoded = JWT.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (error){
        return res.status(401).json({
            error: 'Invalid token'
        })
    }
}
