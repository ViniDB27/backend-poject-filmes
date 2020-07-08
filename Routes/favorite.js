const {PrismaClient} = require('@prisma/client')
const { connect } = require('mysql2')


module.exports = app =>{
    const prisma = new PrismaClient()


    app.post('/favorite', async(req, res)=>{
        const { userId,title, image} = req.body


        prisma.favorite.create({
            data:{
                title,
                imageUrl:image,
                User:{connect:{id:parseInt(userId)}}
            }
        })
        .then(()=>{
            res.json({status:200,message:"filme favoritado"})
        })
        .catch(err=>{
            res.json({status:500,message:err})
            
        })
        
    })

    app.get("/favorite", async(req, res)=>{
        const { id} = req.query

        const favorites = await prisma.favorite.findMany({
            where:{
                userId:parseInt(id)
            }
        })
        

        if(favorites){
            res.json({movies:favorites})
        }else{
            res.json({status:500,message:'erro'})
        }
    })

    app.delete('/favorite', async(req, res)=>{
        const { id } = req.query

        prisma.favorite.delete({where:{
            id: parseInt(id)
        }}).then(
            res.json({status:200, message:'filme removido'})
        )
    })

}