const BookModel = require("../Models/BookModel");
const UserModel = require("../Models/UserModel");
// const ReviewModel = require("../Models/ReviewModel")

const mongoose = require('mongoose');
const ReviewModel = require("../Models/ReviewModel");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const createBook = async function (req, res) {
    try {
        let data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "enter data in user body" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "enter title in the body" })
        }
        const isTitle = await BookModel.findOne({ title })
        if (isTitle) {
            return res.status(400).send({ msg: "Title should be unique" })
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "enter excerpt in  body" })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, msg: "enter valid userId" })
        }
        const isuserId = await UserModel.findOne({ _id: userId })
        if (!isuserId) {
            return res.status(400).send({ msg: "Invalid UserId" })
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "enter ISBN" })
        }
        const isISBN = await BookModel.findOne({ ISBN })
        if (isISBN) {
            return res.status(400).send({ msg: "ISBN is already exists" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "enter category" })
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "enter subcategory" })
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: "relaesed at fill kro" })
        }
        if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt))) {
            return res.status(400).send({ status: false, msg: "date is not in format, YYYY-MM-DD " })
        }


        const createDataBook = await BookModel.create(data)
        return res.status(201).send({ msg: "sucessfully created", data: createDataBook })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const getBooksQuery = async function (req, res) {
    try {
        let filterquery = { isDeleted: false }
        let queryParams = req.query
        const { userId, category, subcategory } = queryParams
        if (userId || category || subcategory) {
            if (isValidRequestBody(queryParams)) {


                if (queryParams.userId && isValidObjectId(userId)) {
                    filterquery['userId'] = userId
                }

                if (isValid(category)) {
                    filterquery['category'] = category.trim()
                }

                if (isValid(subcategory)) {

                    filterquery['subcategory'] = subcategory.trim()

                }
            }

        }
        
        const books = await BookModel.find(filterquery).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        let sortedb = books.sort((a, b) => a.title.localeCompare(b.title));

        // const sortedb = books.sort()
        const count = books.length
        if (books.length < 0) {
            res.status(404).send({ status: false,  msg: "No books found" })
            return
        }

        res.status(200).send({status: true , NumberofBooks:count,  msg: "books list", data: sortedb  })
    } catch (err){
        res.status(500).send({ msg: err.message })
    }
}


const getBookById = async function(req,res){
    try{
        const userId = req.params.bookId
       const getbook = await BookModel.findOne({ _id: userId })
    //    const reviewdata = await ReviewModel.find()
        res.status(200).send({ status: true, message: "sucessfully", result:getbook , reviews: reviewdata})
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    
    }
}


module.exports.createBook = createBook
module.exports.getBooksQuery = getBooksQuery
module.exports.getBookById=getBookById