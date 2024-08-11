const { Router } = require("express")
const router = Router()

router.post('/',(req,res)=>{
   

    res.setHeader('Content-Type','application/json')
    res.status(200).json({})
});

router.get('/:cid',(req,res)=>{
   

    res.setHeader('Content-Type','application/json')
    res.status(200).json({})
});

router.post('/:cid/product/:pid',(req,res)=>{
   

    res.setHeader('Content-Type','application/json')
    res.status(200).json({})
});

module.exports = router