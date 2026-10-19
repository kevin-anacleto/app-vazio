const express = require("express");
const {body, validationResult } = require("express-validator")
const router = express.Router();
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

router.get("/", (req, res) =>{
    res.render("pages/index",{"resultado":null,"erros":null, "valores":{"":""}});
})

router.post("/resultado",
    body("email").isEmail().notEmpty()
    .withMessage("Coloque um email valido!"),
    body("nome").isLength({min:3, max:30}).notEmpty().isAlpha()
    .withMessage("O nome deve conter de 3 a 50 caracets"),
    body("telefone").isMobilePhone().notEmpty()
    .withMessage("Coloque um telefone valido"), (req, res)=>{
        
        const errors = validationResult(req);
     if (!errors.isEmpty()){
          console.log(errors)
          return res.render("pages/index", {"erros":errors, "valores":req.body, "resultado":req.body});
     }
    
    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.email ,
    subject: req.body.assunto,
    text:  req.body.telefone  + req.body.mensagem,

}
transporter.sendMail(mailOptions, (error, info) => {
    if (error){
        console.log(error);
    }else {
        console.log(info);

        console.log("email enviado")
    }
}

)

    res.render("pages/index", {"erros":errors, "valores":req.body, "resultado":req.body});

    }

    
)







module.exports = router;