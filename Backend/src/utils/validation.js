const yup = require('yup');

const userSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    phone: yup.string().required(),
    firstname: yup.string().required(),
    lastname: yup.string().required(),
});

const userLoginSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

const serviceSchema = yup.object({
    title: yup.string().required(),
});
const reviewsSchema = yup.object({
    comment: yup.string().required(),
    star: yup.number().required(),
    postByUser: yup.string().required(),
});
const roomSchema = yup.object({
    services: yup.array().of(yup.string()).required(),
    description: yup.string().required(),
    size: yup.number().required(),
    price: yup.number().required(),
    description: yup.string().required(),
    image: yup.array().of(yup.string()).required(),
    availability: yup.boolean().required(),
    roomType: yup.string(),
    numberOfGuest: yup.number().required(),
});

const apartmentSchema = yup.object({
    title: yup.string().required(),
    rooms: yup.array().of(roomSchema).required(),
});

module.exports = {
    userSchema,
    userLoginSchema,
    serviceSchema,
    apartmentSchema,
    reviewsSchema,
    roomSchema,
};