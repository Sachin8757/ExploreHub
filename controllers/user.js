const User=require('../model/user')



//signup route
module.exports.rendersign= (req, res) => {
    res.render("signup.ejs")
}
module.exports.signup=async (req, res) => {
    let { username, email, password } = req.body;
    try {
        const demouser = new User({
            email: email,
            username: username
        })
        let newuser = await User.register(demouser, password);
        req.login(newuser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to wanderlust!")
            res.redirect("/listing")
        })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }
}
//login route
module.exports.login= (req, res) => {
    res.render("login.ejs")
}

module.exports.loginpost=async (req,res)=>{
    req.flash("success","Welcome back to wanderlust!")
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl)

}

//logout
module.exports.logoutuser=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!")
        res.redirect("/listing")
    })
}