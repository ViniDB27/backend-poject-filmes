const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{
    
    try{
        const token = req.body.token;
        const decode = jwt.verify(token,"#Senha*")
        req.usuario = decode
        next()
    }catch(error){
        res.json({status:401, message:`Falha na autenticação do usuário! erro: ${error}`})
    }
}