const Newsletter = require("../Model/newsletters.model");

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
