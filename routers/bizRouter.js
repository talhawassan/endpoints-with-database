const express = require('express')
const router = new express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const slugify = require('slugify')
const Bizz = require('../models/bizzModel')
const cloudinary = require('../config/cloudinary')
const upload = require('../middlewares/multer')

router.post('/business/create', upload.single('upload'), async (req,res) => {
    const result = await cloudinary.uploader.upload(req.file.path, {folder: 'photoClikk'})
    const bizz = new Bizz({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        slug: slugify(req.body.name),
        image: result.secure_url ,
        phone: req.body.phone,
        area: req.body.area,
        town: req.body.town,
        city: req.body.city,
        businessType: req.body.businessType,
        services: req.body.services,
        costPerHour: req.body.costPerHour,
        description: req.body.description,
        whatsAppNo: req.body.whatsAppNo,
        basicPackage: req.body.basicPackage,
        standardPackage: req.body.standardPackage,
        premiumPackage: req.body.premiumPackage,
        includes: req.body.includes,
        camera: req.body.camera,
        lense: req.body.lense,
        drone: req.body.drone,
        portfolio: req.body.portfolio
    })
    const salt = await bcrypt.genSalt(10);
     
    try {
        bizz.password = await bcrypt.hash(bizz.password, salt);
        // Create token
       const token = jwt.sign(
       {_id: bizz._id },
         process.env.TOKEN_KEY,
         {
          expiresIn: 86400,
            }
          );
        // save user token
       bizz.token = token;
       await bizz.save()
       res.status(201).send(bizz)
    }catch (e) {
       res.status(400).send(e)
    }
})

router.get('/business/read/list', async (req,res) => {
     try {
          const bizz = await Bizz.find({})
          res.send(bizz)
     } catch (e) {
          res.status(500).send(e)
     }
})

module.exports = router