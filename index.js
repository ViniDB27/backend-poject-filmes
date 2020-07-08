const express = require('express')
const consign = require('consign')
const cors = require('cors')


const firewall = express()

firewall.use(cors())
firewall.use(express.json())

consign().include('Routes').into(firewall)

firewall.listen(3333, ()=>{
    console.log('Server open')
})