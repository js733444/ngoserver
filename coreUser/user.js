const mongoose = require('mongoose');
const bcrypt  = require('bcrypt');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {type: String, required: true, max: 100, unique: true},
    password: {type: String, required: true, max: 100, select: false},
    userType: {type: String, enum: ['admin', 'regular'], default: 'regular'},
    userDetail: {
        firstName: String,
        lastName: String,
        cma: String,
        phone: String,
        email: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        urbanization: String
    }
});


UserSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password) ? true:false;
};

UserSchema.methods.updatePassword = function (password, callback) {
    this.password = bcrypt.hashSync(password, 10);
    this.save(callback);
};

UserSchema.statics.customFindByIdAndUpdate = function (id, body, callback) {
    if (body.password){
        body.password = bcrypt.hashSync(body.password, 10);
    }
    this.findByIdAndUpdate(id, body, {new: true}, callback);
};

UserSchema.statics.customCreate = function (body, callback){
    if (body.password){
        body.password = bcrypt.hashSync(body.password, 10);
    }
    (new this(body)).save(callback);
}



// Export the model
module.exports = mongoose.model('User', UserSchema);