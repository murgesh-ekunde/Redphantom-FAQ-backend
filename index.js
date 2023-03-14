const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const app = express();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config()

app.use(express.json());
mongoose.connect(process.env.MONGODB_URL)
.then(() => app.listen(4000,()=>
console.log("connected to DB and Server")
)).catch((e)=>console.log(e));

app.use(function (req, res, next) {
  const allowedOrigins = ['https://redphantom-faq-frontend-66zi.vercel.app/'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin','https://redphantom-faq-frontend-66zi.vercel.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  }
  return next();
  });



app.post('/register', async (req,res) => {
  const {name, email, question, message, answer} = req.body;
  try{
    const userDoc = await User.create({
      name,
      email,
      question,
      message,
      answer
    });
    return res.json(userDoc);
  } catch(e) {
    console.log(e);
    return res.status(400).json(e);
  }
});


app.get('/question', async (req,res) => {
try {
    const que = await User.find();
    res.status(200).json({success: true, data:que})
} catch (error) {
    res.status(500).json({success: false, message: error})
}
});

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:(process.env.USER),
      pass:(process.env.PASS),
    },
  });
  
  contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
  });

  app.post("/contact", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message; 
    const mail = {
      from: name,
      to: "murgeshwork@proton.me",
      subject: "Contact Form Submission By Murgesh Ekunde",
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json({ status: "ERROR" });
      } else {
        res.json({ status: "Message Sent" });
      }
    });
  });