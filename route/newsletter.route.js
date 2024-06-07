const Router = require("express").Router();
const newsletterController = require("../controller/newsletters.controller");

Router.post(
  "/v2/api/manage/newsletter/create",
  newsletterController.createNewsletter
);
Router.post(
  "/v2/api/manage/newsletter/getOne",
  newsletterController.getNewsletterById
);
Router.get(
  "/bludibs/v2/api/manage/newsletter/getAll",
  newsletterController.getAllNewsletter
);
Router.post(
  "/v2/api/manage/newsletter/updateStatus",
  newsletterController.updatesNewsletterStatus
);
Router.post(
  "/v2/api/manage/newsletter/updateData",
  newsletterController.updateData
);
Router.post("/v2/api/manage/newsletter/delete", newsletterController.delete);
Router.post(
  "/v2/api/manage/newsletter/send",
  newsletterController.sendNewsletter
);
module.exports = Router;
