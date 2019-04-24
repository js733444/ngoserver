const mongooose = require ('mongoose');
const Schema = mongooose.Schema;


// Mongoose/node has no native support for decimal support. 
// I am awared of the limitations of the floating point precision in handling money
const Donation = new mongooose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Date, required: true},
    event: {type: Schema.Types.ObjectId, ref: 'Event'},
    amount: {type: Number, required: true},
});

module.exports=mongooose.model('Donation', Donation);