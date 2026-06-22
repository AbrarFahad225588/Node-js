const express = require("express");
const { User } = require("../models/user");
const { handleAllUsers, handleUserById, handleUserCreate, handleUpdateUser, handleDeleteUser } = require("../controllers/user");

const router = express.Router();




router.route('/').get(handleAllUsers).post(handleUserCreate);
router.route('/:id').get(handleUserById).patch(handleUpdateUser).delete(handleDeleteUser)


module.exports = router;