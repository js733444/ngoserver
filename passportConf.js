module.exports = function isAdminOr403(req, res){
    if (req.user){
        console.log("req.user", req.user);
        if (req.user.userType === "admin"){
            return true;
        }else{
            res.send(403, "Forbbiden");
        }
    }else{
        res.send(401, "Unauthorized");
        return false;
    }
}