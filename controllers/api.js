const PortData = require('../models/portdata');
const QRCode = require('qrcode');
const path = require('path');
const Category = require('../models/category');

exports.getIndex = (req, res, next) => {
    res.send("aaa");
};

exports.getCategory = (req, res, next) => {
    let cat_query = {};
    Category.query.getAllData((cat_query), (catdata, err) => {
        if (!err) {
            res.json({
                success: 1,
                return: catdata,
                message: "Complete"
            });
        }
        else {
            res.json({
                success: 0,
                return: null,
                message: err
            });
        }
    });
};

exports.getPort = (req, res, next) => {
    let port_query = {};
    const get_cat = req.query.cat;
    const get_lang = req.query.lang;
    
    if(get_cat!=""&&get_cat!=='undefined')
    {
        port_query.category = get_cat;
    }

    if(get_lang!=""&&get_lang!=='undefined')
    {
        port_query.language = get_lang;
    }

    PortData.query.getAllData(port_query, (portdata, err) => {
        if (!err) {
            res.json({
                success: 1,
                return: portdata,
                message: "Complete"
            });
        }
        else {
            res.json({
                success: 0,
                return: null,
                message: err
            });
        }
    })
};

exports.getOnePort = (req, res, next) => {
    const id = req.query.id;
    
    if(id!=""&&id!=='undefined')
    {
        PortData.findById(id, function (err, portdata) {
            if(err){
                res.json({
                    success: 0,
                    return: err,
                    message: "Error Query"
                });
            }
            else
            {
                res.json({
                    success: 1,
                    return: portdata,
                    message: "Complete"
                });
            }
        });
    }
    else
    {
        res.json({
            success: 0,
            return: null,
            message: "No ID Parameter"
        });
    }
};