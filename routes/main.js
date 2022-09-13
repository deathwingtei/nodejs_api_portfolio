const path = require('path');
const express = require('express');
const router = express.Router();
//const rootDir = require('../util/path');
const mainController = require('../controllers/main');
const multer = require('multer');
const upload_0 = multer({ dest: './public/uploads/' });
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads/port_img');
    },
    filename:(req,file,cb)=>{
        cb(null,"port_"+Date.now()+".jpg");
    }
});

const upload = multer({
    storage:storage
});
// main get route
router.get('/index', mainController.getIndex);
router.get('/setportlogin', mainController.getLogin);
router.get('/mainpage', mainController.getMain);
router.get('/category', mainController.getCategory);
router.get('/logout', mainController.getLogout);
router.post('/port_login_process', mainController.postLogin);
router.post('/update_category', mainController.postUpdateCategory);
router.post('/delete_category',upload_0.none(), mainController.postDeleteCategory);
router.post('/update_port',upload.single("images"), mainController.postUpdatePort);
// router.post('/upload_file',upload.single("images"), mainController.postTestUploadFile);
router.post('/delete_port',upload_0.none(), mainController.postDeletePort);

module.exports = router;