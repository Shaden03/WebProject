const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePasswords = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;

















// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs');

// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });

// // Hash password before saving user to database
// userSchema.pre('save', function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
//     next();
// });

// // Method to compare password
// userSchema.methods.comparePasswords = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;

