const express = require('express');
const router = express.Router();



const UserController = require("../Controllers/UserController")
const BookController = require("../Controllers/BookController")
const Middleware = require("../Middlewares/Auth")


router.post("/register",UserController.CreateUser)
router.post("/login",UserController.loginUser)
router.post("/createBook",Middleware.authentication,BookController.createBook)

router.get("/getbookdata",Middleware.authentication,BookController.getBooksQuery)

router.get("/getbookbyid",Middleware.authentication,BookController.getBookById)






module.exports=router;