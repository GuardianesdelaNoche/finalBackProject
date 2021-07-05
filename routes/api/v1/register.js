'use strict'

var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');
const {body, validationResult} = require('express-validator');
const path = require('path');
const pv = require('password-validator'); //control password restrictions


const User = require('../../../models/User');


const passwordSchema = new pv();
passwordSchema
    .is().min(8)
    .is().max(20)
    .has().uppercase(2)
    .has().lowercase()
    .has().digits(1);



//Grabación de nuevos anuncios con validación incluida y subida de imagen
//outer.post('/', jwtAuth, upload,
router.post('/', jwtAuth,
    [
        body('username').isLength({ min: 6 }).escape().withMessage('El campo username es obligatorio'),
        body('email').isEmail().escape().withMessage('El campo email es obligatorio'),
        body('role').isNumeric().withMessage('El rol debe ser numérico'),
        body('nickname').not().isEmpty().trim().escape().withMessage('El nickname es obligatorio'),
        body('password').custom(password => {   
            
            //Validamos si la password que nos pasan están dentro de los permitidos
            if ((typeof password != 'undefined') && !passwordSchema.validate(password)){
                console.log('Password no validado 1')
                return false
            }else{
                console.log('Password validado 2 ')
                return true
            }
        }),
        body('email').custom(async email=>{
            const resultE = await User.existsEmail(email);
            if (resultE >0){
                throw new Error(`Email duplicado: ${email}`);
            } else {
                return true
            }
        }).escape().withMessage('El campo email, está duplicado'),
        
        body('username').custom(async username=>{
            const resultU = await User.existsUserName(username);
            if (resultU >0){
                throw new Error(`Username duplicado: ${username}`);
            } else {
                return true
            }
        }).escape().withMessage('El campo username, está duplicado'),
        
        body('nickname').custom(async nickname=>{
            const resultN = await User.existsNickName(nickname);
            if (resultN >0){
                throw new Error(`Nickname duplicado: ${nickname}`);
            } else {
                return true
            }
        }).escape().withMessage('El campo nickname, está duplicado'),
        
    ], 
 async (req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        // const namePhoto = req.file ? req.file.filename :''
        
        // const anuncioCreado = await Anuncio.newAnuncio(req.body,namePhoto);
        // //Una vez guardado el anuncio, llamamos al microservicio para procesar el thumbnail de la imágen
        // const nameImage = namePhoto
    
        // requester.send({
        //     type: 'convertir imagen',
        //     nameImage : nameImage,
        // }, resultado =>{
        //     if (!resultado) {
        //         console.erro('Error en microservice al crear el thumbnail')};
        //     //console.log(`Cambiamos el nombre de la imágen a : ${resultado}`)
        // })

        // res.status(201).json({result: anuncioCreado});
        res.status(201).json({result:'resultado ok' });
    } catch (error) {
        next(error)      
        }
});




module.exports = router;