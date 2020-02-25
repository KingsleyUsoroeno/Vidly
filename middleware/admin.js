module.exports = function(req, res, next){
    // These middleware function will be called after we called the auth middleware function
    if(!req.user.isAdmin) return res.status(403).json({message:'Access denied'});
    next();
}