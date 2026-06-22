const { User } = require("../models/user");

const handleAllUsers = async (req, res) => {
    try {
        const rows = await User.getAll();
        res.setHeader("Content-type", "application/json");
        res.setHeader("X-Host", "Fahad-NodeJs");
        res.setHeader("love", "mane balupasha");
        console.log(req.headers)
        res.status(201).send(JSON.stringify(rows));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
}

const handleUserById = async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const user = await User.getById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
}
const handleUpdateUser = async (req, res) => {
    const userId = Number(req.params.id);
    const validationResult = User.validatePatch(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: validationResult.error.flatten().fieldErrors
        });
    }
    console.log(validationResult.data)
    try {
        const updatedUser = await User.update(userId, validationResult.data);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
}
const handleDeleteUser = async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const user = await User.delete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}
const handleUserCreate = async (req, res) => {
    const validationResult = User.validate(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: validationResult.error.flatten().fieldErrors
        });
    }
    try {
        const insertId = await User.create(validationResult.data);
        res.status(200).json({
            message: 'User created successfully',
            userId: insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
}
module.exports = { handleAllUsers, handleUserById, handleUserCreate, handleUpdateUser, handleDeleteUser }