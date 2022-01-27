const express = require("express");
const hbs = require("hbs");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 8000;


require("./db/conn");

const SignUp = require("./models/signup");

const templatePath = path.join(__dirname,"./templates");
app.set("view engine","hbs");
app.set("views",templatePath);
app.use(express.static(templatePath));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

let myInfo = nodemailer.createTransport({
    service:"gmail",
    port:port,
    auth:{
        user:"hsjaiswal3110@gmail.com",
        pass:"Harsh@1234#"
    }
})

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.get("/forgot",(req,res)=>{
    res.render("forgot");
})
app.get("/emailVerification",(req,res)=>{
    res.render("emailVerification")
})
app.post("/signup",(req,res)=>{
    try {
        const password = req.body.myPassword;
        const cpassword = req.body.myConPassword;
        if(password===cpassword){
            const registerStd = SignUp({
                fullName : req.body.fullname,
                email : req.body.myemail,
                gender : req.body.mygender,
                course : req.body.mycourse,
                password : req.body.myPassword,
                confirmpass : req.body.myConPassword
            })

            const otp = Math.round(1000 + (9999 - 1000) * (Math.random()));
            let mailOptions={
                from:"hsjaiswal3110@gmail.com",
                to: req.body.myemail,
                subject:"Message from harsh jaiswal",
                text:`${otp}`
            }
            myInfo.sendMail(mailOptions,function(err,info){
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send(info.response);
                }
            })
            res.status(201).render("emailVerification");
            app.post("/emailVerification",(req,res)=>{
                if(otp==req.body.emailverify){
                    res.status(201).render("payment")
                    const result = registerStd.save();
                }
                else{
                    res.send("Invalid OTP")
                }
            })
        }
        else{
            res.send("Password not matched");
        }
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/login",async(req,res)=>{
    try{
        const email = req.body.myemail;
        const pass = req.body.myPassword;
        const useremail=await SignUp.findOne({email:email});
        if(!useremail){
            res.send("Invalid login details")
        }
        else if(pass===useremail.password){
            if(email.includes("@elearning.edu.in")){
                res.send("hello");
            }
            else{
                res.render("course")
            }
        }
        else{
            res.send("Invalid login details")
        }
    }catch(err){
        console.log(err)
    }
})
app.listen(port,()=>{
    console.log(`Program executed successfull at port no ${port}`);
})