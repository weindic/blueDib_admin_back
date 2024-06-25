const Router = require('express').Router();
const controller = require('../controller/adminData.controller')
const userController = require('../controller/users.controller')
const adminAlertController = require('../controller/adminAlertController');

// admin role action 

Router.post('/bludibs/api/manage/login' ,controller.userLogin )
Router.post('/bludibs/v2/api/manage/addAdmin' ,controller.addAdmin )
Router.get('/bludibs/v2/api/manage/getAllAdminData' ,controller.getAllAdmins )
Router.post('/bludibs/v2/api/manage/getAdminById' ,controller.getAdminById )
Router.put('/bludibs/v2/api/manage/updateAdmin' ,controller.updateAdmin )
Router.post('/bludibs/v2/api/manage/deleteAdmin' ,controller.deleteAdmin )
Router.post('/bludibs/v2/api/manage/deactivateAdmin' ,controller.deactivateAdmin )

// users actions=============//

Router.get('/bludibs/v2/api/manage/getAllUsers' ,userController.getAllUsers )
Router.get('/bludibs/v2/api/manage/getTransactions' ,userController.getTransactions )
Router.get('/bludibs/v2/api/manage/getWithdrawData' ,userController.getWithdrawData )
Router.get('/bludibs/v2/api/manage/getPaymentRequest' ,userController.getPaymentRequest )
Router.post('/bludibs/v2/api/manage/deactivateUser', userController.deactivateUser);
Router.post('/bludibs/v2/api/manage/kyc', userController.changeKyc);
Router.get('/bludibs/v2/api/masterData', controller.getMasterData);


// VIP chat function ==============//

Router.post('/bludibs/v2/api/vip/enableChat' ,userController.enableChat )
Router.post('/bludibs/v2/api/vip/getChat' ,userController.getChat )
Router.post('/bludibs/v2/api/makePopularUser', userController.makePopularUser);

// admin alerts
Router.post('/bludibs/v2/api/adminAlerts', adminAlertController.createAdminAlert);
Router.get('/bludibs/v2/api/adminAlerts', adminAlertController.getAdminAlerts);
Router.get('/bludibs/v2/api/adminAlerts/:id', adminAlertController.getAdminAlertById);
Router.put('/bludibs/v2/api/adminAlerts/:id', adminAlertController.updateAdminAlert);
Router.delete('/adminAlerts/:id', adminAlertController.deleteAdminAlert);

//newsletter functions =======//
// Router.get('/newsletter/:newsletterId', newsletterController.getNewsletterWithUsers);

// paymet request and sell request===========//


Router.get('/bludibs/v2/api/paymentRequests', userController.getPaymentRequest);
Router.put('/bludibs/v2/api/updateFundStatus', userController.updateFundStatus);

Router.get('/bludibs/v2/api/getSellRequestData', userController.getSellRequest);
Router.put('/bludibs/v2/api/executeSellRequest', userController.executeSellRequest);

module.exports = Router;