const PortData = require('../models/portdata');
const Category = require('../models/category');
const User = require('../models/user');
const path = require('path');
const crypto = require('crypto');
const is_ip_private = require('private-ip');
require('dotenv').config();
// main get controller

exports.getIndex = (req, res, next) => {
    res.send("No Index");
};

exports.getLogin = (req, res, next) => {
    var ip = getIPAddress();
    if (is_ip_private(ip)) {
        //inaset temp data
        const hash = crypto.createHash('sha512');
        const keynnc = process.env.ENC_KEY;
        let encpassword = hash.update("123456" + keynnc, 'utf-8');
        encpassword = encpassword.digest('hex');
        data = {
            email: "admin@admin.com",
            password: encpassword,
            name: 'admin'
        };
        update = { expire: new Date() },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        User.findOneAndUpdate(data, update, options, function (error, result) {
            if (!error) {
                // If the document doesn't exist
                if (!result) {
                    // Create it
                    result = new User();
                }
                // Save the document
                result.save(function (error) {
                    if (!error) {
                        // Do something with the document
                    } else {
                        throw error;
                    }
                });
            }
        });
    }

    if (req.session.login) {
        res.redirect("/mainpage");
    }
    else {
        res.render('login');
    }
};

exports.getMain = (req, res, next) => {
    const appname = process.env.APP_NAME || "MY PORT";
    let cat_query = {};
    let port_query = {};

    stayLogin(req);

    Category.query.getAllData(cat_query, (catdata, err) => {
        if (!err) {
            PortData.query.getAllData(port_query, (portdata, err) => {
                if (!err) {
                    if (req.session.login) {
                        return res.render('main', { user_data: req.session, port_data: portdata, catdata_data: catdata, appname: appname, pagename: 'main' });
                    }
                    else {
                        return res.redirect("/login");
                    }
                }
            })
        }
        else {
            return res.redirect("/login");
        }
    })


};

exports.getCategory = (req, res, next) => {
    const appname = process.env.APP_NAME || "MY PORT";
    let cat_query = {};

    stayLogin(req);

    Category.query.getAllData((cat_query), (catdata) => {
        if (req.session.login) {
            return res.render('cat', { user_data: req.session, catdata_data: catdata, appname: appname, pagename: 'category' });
        }
        else {
            return res.redirect("/login");
        }
    });
};

exports.postLogin = (req, res, next) => {

    // console.log(req.body.email);
    const hash = crypto.createHash('sha512');
    const keynnc = process.env.ENC_KEY;
    const email = req.body.email;
    const password = req.body.password;
    let encpassword = hash.update(password + keynnc, 'utf-8');
    encpassword = encpassword.digest('hex');
    data = {
        email: email,
        password: encpassword
    };

    User.findOne(data, function (err, user) {
        if (err) {
            res.json({
                success: 0,
                return: null,
                message: err
            });
        }
        else {
            if (!user) {
                res.json({
                    success: 0,
                    return: null,
                    msg: "not found"
                });
            }
            else {
                req.session.name = user.name;
                req.session.id = user._id;
                req.session.login = true;

                res.json({
                    success: 1,
                    return: 1,
                    msg: "success"
                });
            }
        }
    })

};

exports.postUpdateCategory = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const order_show = req.body.order_show;

    if ((typeof name === 'undefined') || name == "") {
        res.json({
            success: 0,
            return: "",
            msg: "Please Input Name",
        });
        return false;
    }

    if ((typeof id === 'undefined') || id == "") {
        //insert logic

        Category.countDocuments({ name: name, discard: 0 }, (err, count) => {
            if (count > 0) {
                res.json({
                    success: 0,
                    return: "",
                    msg: "Dupplicate Name",
                });
                return false;
            }
            else if (err) {
                res.json({
                    success: 0,
                    return: err,
                    msg: "Has some Error",
                });
                return false;
            }
            else {
                const savedata = new Category({ name: name, order_show: order_show });
                savedata.save(function (err, book) {
                    if (err) {
                        let errmsg = "Failed to Insert";
                        if (err.codeName == "DuplicateKey") {
                            errmsg = "Name Dupplicate";
                        }
                        res.json({
                            success: 0,
                            return: err,
                            msg: errmsg
                        });
                        return false;
                    }

                    res.json({
                        success: 1,
                        return: "",
                        msg: "Insert Data Complete."
                    });
                });
            }
        });
    }
    else {
        //update
        Category.findByIdAndUpdate(id, { name: name, order_show: order_show, dateTimeUpdated: Date.now() }, { runValidators: true }, function (err, result) {
            if (err) {
                let errmsg = "Failed to Insert";
                if (err.codeName == "DuplicateKey") {
                    errmsg = "Name Dupplicate";
                }
                res.json({
                    success: 0,
                    return: err,
                    msg: errmsg
                });
                return false;
            }
            else {
                res.json({
                    success: 1,
                    return: result,
                    msg: "Updated Data Complete."
                });
            }
        });
    }
};

exports.postDeleteCategory = (req, res, next) => {
    const id = req.body.delete_id;

    if ((typeof id === 'undefined') || id == "") {
        res.json({
            success: 0,
            return: "",
            msg: "No data"
        });
        return false;
    }
    else {
        //update
        Category.findByIdAndUpdate(id, { discard: 1, dateTimeUpdated: Date.now() }, function (error, result) {
            if (error) {
                res.json({
                    success: 0,
                    return: error,
                    msg: "Failed to update"
                });
            }
            else {
                res.json({
                    success: 1,
                    return: result,
                    msg: "Updated Data Complete."
                });
            }
        });
    }
};

exports.postTestUploadFile = (req, res, next) => {
    const id = req.body.id;
    let fileres = "";
    if (typeof req.file !== 'undefined') {
        fileres = req.file.filename;
    }

    res.json({
        success: 0,
        return: fileres,
        msg: fileres,
    });
    return false;
};

exports.postUpdatePort = (req, res, next) => {
    let fileres = "";
    const id = req.body.id;
    const name = req.body.name;
    const link = req.body.link;
    const images_link = req.body.images_link;
    const content = req.body.content;
    const technology = req.body.technology;
    const api = req.body.api;
    const category = req.body.category;
    const language = req.body.language;
    const order_show = req.body.order_show;
    const discard = req.body.discard;

    if ((typeof name === 'undefined') || name == "") {
        res.json({
            success: 0,
            return: "",
            msg: "Please Input Name",
        });
        return false;
    }

    if (typeof req.file !== 'undefined' && req.file != "") {
        // fileres = req.protocol+"://"+req.headers.host+'/uploads/port_img/'+req.file.filename;
        fileres = "https://"+req.headers.host+'/uploads/port_img/'+req.file.filename;
    }
    else {
        fileres = images_link;
    }
    let insertdata = { name: name, link: link, images: fileres, content: content, technology: technology, api: api, category: category, language: language, order_show: order_show }


    if ((typeof id === 'undefined') || id == "") {
        //insert logic

        PortData.countDocuments({ name: name, language: language, discard: 0 }, function (err, count) {
            if (count > 0) {
                res.json({
                    success: 0,
                    return: "",
                    msg: "Dupplicate Name",
                });
                return false;
            }
            else if (err) {
                res.json({
                    success: 0,
                    return: err,
                    msg: "Has some Error",
                });
                return false;
            }
            else {
                const savedata = new PortData(insertdata);
                savedata.save(function (err, result) {
                    if (err) {
                        let errmsg = "Failed to Insert";
                        if (err.codeName == "DuplicateKey") {
                            errmsg = "Name Dupplicate";
                        }
                        res.json({
                            success: 0,
                            return: err,
                            msg: errmsg
                        });
                        return false;
                    }

                    res.json({
                        success: 1,
                        return: result,
                        msg: "Insert Data Complete."
                    });
                });
            }
        });
    }
    else {
        //update
        insertdata.dateTimeUpdated = Date.now();
        PortData.findByIdAndUpdate(id, insertdata, { runValidators: true }, function (err, result) {
            if (err) {
                let errmsg = "Failed to Insert";
                if (err.codeName == "DuplicateKey") {
                    errmsg = "Name Dupplicate";
                }
                res.json({
                    success: 0,
                    return: err,
                    msg: errmsg
                });
                return false;
            }
            else {
                res.json({
                    success: 1,
                    return: result,
                    msg: "Updated Data Complete."
                });
            }
        });
    }
};

exports.postDeletePort = (req, res, next) => {
    const id = req.body.delete_id;

    if ((typeof id === 'undefined') || id == "") {
        res.json({
            success: 0,
            return: "",
            msg: "No data"
        });
        return false;
    }
    else {
        //update
        PortData.findByIdAndUpdate(id, { discard: 1, dateTimeUpdated: Date.now() }, function (error, result) {
            if (error) {
                res.json({
                    success: 0,
                    return: error,
                    msg: "Failed to update"
                });
            }
            else {
                res.json({
                    success: 1,
                    return: result,
                    msg: "Updated Data Complete."
                });
            }
        });
    }
};


exports.getLogout = (req, res, next) => {
    // res.clearCookie('login');
    // res.clearCookie('username');
    // res.redirect("/login");
    req.session.destroy((err) => {
        res.redirect("/setportlogin");
    });
};

stayLogin = (req) => {
    var ip = getIPAddress();
    if (is_ip_private(ip)) {
        if (!req.session.login) {
            req.session.name = "KP";
            req.session.id = "630da2b98bbac1399daa934d";
            req.session.login = true;
        }
    }
}

// getAllCatData = (query, cb) => {
//     Category.find(
//         {
//             $or: [
//                 { discard: false },
//                 { discard: { $exists: false } },
//             ]
//         }).exec()
//         .then((catdata) => {
//             cb(catdata);
//         })
// }

// getcategory= async() => {
//     const catdata = await Category.find(
//     {
//         $or: [
//             { discard: false },
//             { discard: { $exists: false } },
//         ]
//     }).exec();

//     return catdata;
// }