const mongooose = require ('mongoose');

const Event = new mongooose.Schema({
    eventName:String,
    eventDetail:String
});

module.exports=mongooose.model('Event', Event);