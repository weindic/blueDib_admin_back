const Newsletter = require("../Model/newsletters.model");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "weindic.inc@gmail.com",
    pass: "kgof qncb ogjv nroa",
  },
});

exports.getNewsletterWithUsers = async (newsletterId) => {
  try {
    const newsletter = await Newsletter.findById(newsletterId).exec();

    if (!newsletter) {
      throw new Error("Newsletter not found");
    }

    await newsletter.populate("users").execPopulate();

    return newsletter;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.createNewsletter = async (newsletterData) => {
  const newsletter = new Newsletter(newsletterData);
  return await newsletter.save();
};

exports.getNewsletterById = async (newsletterId) => {
  const newsletter = await Newsletter.findById(newsletterId);
  return newsletter;
};

exports.getAllNewsletter = async () => {
  return await Newsletter.find().populate("createdBy", "name -_id");
};

exports.updateNewsletterStatus = async (id, status) => {
  return await Newsletter.findOneAndUpdate(
    { _id: id },
    { status, updatedAt: new Date() },
    { new: true }
  );
};

exports.updateNewsletterData = async (id, data) => {
  return await Newsletter.findOneAndUpdate(
    { _id: id },
    { ...data, updateAt: new Date() },
    { new: true }
  );
};

exports.deleteNewsletter = async (id) => {
  try {
    const newsletter = await Newsletter.findByIdAndRemove({ _id: id });
    if (!newsletter) {
      return {
        data: null,
        status: false,
        message: "Newsletter not found!",
      };
    }
    return {
      data: null,
      status: true,
      message: "Newsletter deleted successfully!",
    };
  } catch (error) {
    return {
      data: null,
      status: false,
      message: "An error occurred while deleting newsletter",
    };
  }
};

exports.sendNewsletter = async (newsletterId) => {
  try {
    const newsletter = await Newsletter.findById(newsletterId);
    if (!newsletter) {
      throw new Error("Newsletter not found");
    }

    const mailOptions = {
      from: "help@recyclebaba.com",
      subject: newsletter.title,
      html: newsletter.template,
    };

    for (const email of newsletter.emailId) {
      mailOptions.to = email;
      await transporter.sendMail(mailOptions);
    }

    return { success: true, message: "Emails sent successfully" };
  } catch (error) {
    console.error("Error sending newsletter:", error);
    throw new Error("Error sending newsletter");
  }
};
