const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt=require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Thisisinotesreact@app1"

//ROUTE 1: Create a user using POST:"/api/auth/createuser" no login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min : 3}),
    body('email','Invalid Email').isEmail(),
    body('password','Password must have atleast 5 characters').isLength({ min: 5 }),
], async (req,res)=>{
        let success = false;
        //if there are errors ,return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({success, errors: errors.array() });
        }
        try {
          
        //check whether a email exists or not
        let user = await User.findOne({email : req.body.email});
        if(user){
          return res.status(400).json({success,error : "Sorry this email already exists"})
        }
        //Create a new user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt)
        user = await User.create({
            name: req.body.name,
            password: secPass ,
            email: req.body.email
          })
          const data = {
            user : {
              id : user.id,
            }
          }
          const authtoken = jwt.sign(data,JWT_SECRET)
          console.log(authtoken);
          success=true;
          res.json({success,authtoken});
        } 
        //catch errors
        catch (error) {
          console.error(error.message);
          res.status(500).send("Internal server error")
          }
        //   .then(user => res.json(user))
        //   .catch(err => {console.log(err)
        // res.json({error : 'Email address already exist',message: error.message})});
    
})
//ROUTE 2: Create a user using POST:"/api/auth/login" no login required
router.post('/login',[
  
  body('email','Invalid Email').isEmail(),
  body('password','Password cannot be blank').exists(),
], async (req,res)=>{
  //if there are errors ,return bad request and the errors
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body
  try {
    let user = await User.findOne({email});
        if(!user){
          return res.status(400).json({success,error : "Please try to login with correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password , user.password);
        if(!passwordCompare){
          return res.status(400).json({success,error : "Please try to login with correct credentials"})
        }
        const data = {
          user : {
            id : user.id,
          }
        }
        const authtoken = jwt.sign(data,JWT_SECRET)
        success=true;
        res.json({success,authtoken});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error")
  }
})
//ROUTE 3: Get user details using POST:"/api/auth/getuser" Login required
router.post('/getuser',fetchuser, async (req,res)=>{
 try {
   const userId = req.user.id
   const user = await User.findById(userId).select("-password")
   res.send(user);
 } catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error")
}
})
module.exports = router;