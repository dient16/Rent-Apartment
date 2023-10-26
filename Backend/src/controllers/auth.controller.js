const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const to = require('await-to-js').default;

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12));

const register = async (req, res, next) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({
            status: 'fail',
            message: 'All fields are required!',
        });
    }
    const [err, existingUser] = await to(User.findOne({ email }));
    if (err) throw err;
    if (existingUser) {
        return res.status(404).json({
            status: 'fail',
            message: 'Email has already been used!',
        });
    }
    const [errCreateUser, newUser] = await to(
        User.create({
            email: email,
            password: hashPassword(password),
            firstname: firstname,
            lastname: lastname,
        }),
    );
    if (errCreateUser) {
        return res.status(500).json({
            status: 'fail',
            message: 'Register is fail!',
        });
    }
    return res.status(200).json({
        status: 'success',
        message: 'Register is successful!',
        userData: newUser,
    });
};

module.exports = {
    register,
};
