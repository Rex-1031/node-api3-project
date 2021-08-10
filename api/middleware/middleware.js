const User = require('../users/users-model')


function logger(req, res, next) {
  // DO YOUR MAGIC
  const time = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl
  console.log(`A [${method}] request was made on ${url}  at ${time}`)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try{
      const user =  await User.getById(req.params.id)
      if(!user){
        req.status(404).json(
            { message: "user not found" }
        )
      }else{
          req.user = user
      }
      next()
  }
  catch{
      req.status(500).json(
          {message: "Server error"}
      )
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
      if(!req.body.name){
          res.status(400).json(
              {message: "missing required name field"}
          )
      }else{
          next();
      }
      
  }



function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.text){
      res.status(400).json(
        { message: "missing required text field" }
      )
  }else{
      next();
  }
}

// do not forget to expose these functions to other modules
module.exports={
    logger,
    validateUserId,
    validateUser,
    validatePost
}