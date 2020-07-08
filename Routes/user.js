const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = app =>{

    const prisma = new PrismaClient()

    app.post('/register', async(req,res)=>{
        const {email, password} = req.body


        const EmailExist = await prisma.user.findOne({
            where:{
                email,
            }
        })

        if(EmailExist){
            res.status(500).send({error: `usuário ${email} já existe!`})
        }else{
            
            bcrypt.hash(password, 10, async (errBcrypt, hash)=>{
                if(errBcrypt){return res.status(500).send({error:errBcrypt})}
    
                await prisma.user.create({
                    data:{
                        email,
                        password: hash,
                    }
                }).then(()=>{
                    res.json({status:200, message:`usuário ${email} cadastrado com sucesso!`})
                }).catch(erro=>{
                
                    res.json({status:200, message:erro})

                }) 
    
            })

        }


   
    })

    app.post('/login', async(req, res)=>{
        const { email, password } = req.body

        const user = await prisma.user.findOne({
            where:{
                email,
            }
        })

        if(user){

            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                    return res.status(409).send({error:"Falha de autenticação"})
                }
                if(result){
                    const token = jwt.sign({
                            id: user.id,
                            email: user.email
                        
                        },
                        "123",
                        {
                            expiresIn:"24h"
                        }

                    )

                    return res.status(200).send({
                        message:"Autenticado com sucesso",
                        token,
                        userId: user.id
                    })
                }

                return res.status(409).send({error:"Falha de autenticação"})
            })




        }else{
            return res.status(409).send({error:"Falha de autenticação"})
        }

    })


}