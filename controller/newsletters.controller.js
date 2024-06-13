const NewsletterService = require("../Service/newsletters.service");
exports.getNewsletterWithUsers = async (req, res) => {
  try {
    const { newsletterId } = req.params;
    const newsletter = await NewsletterService.getNewsletterWithUsers(
      newsletterId
    );
    res.status(200).json(newsletter);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createNewsletter = async (req, res) => {
  try {
    const { emailId, users, template, title } = req.body;
    if (!emailId) {
      return res.status(400).json({ error: "emailId is required " });
    }

    const newsletterData = {
      emailId,
      users,
      template,
      title,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newsletter = await NewsletterService.createNewsletter(newsletterData);
    return res.status(200).json(newsletter);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getNewsletterById = async (req, res) => {
  try {
    const id = req.body.id;
    const newsletter = await NewsletterService.getNewsletterById(id);
    return res.status(200).json(newsletter);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllNewsletter = async (req, res) => {
  try {
    const newsletters = await NewsletterService.getAllNewsletter();
    return res.status(200).json(newsletters);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updatesNewsletterStatus = async (req, res) => {
  try {
    const newsletter = await NewsletterService.updateNewsletterStatus(
      req.params.id,
      req.body.status
    );
    console.log(newsletter);
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found!" });
    }
    res.status(200).json(newsletter);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateData = async (req, res) => {
  try {
    const newsletterId = req.body.id;
    const updateData = req.body;
    const newsletter = await NewsletterService.updateNewsletterData(
      newsletterId,
      updateData
    );
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    res.status(200).json(newsletter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const newsletterId = req.body.id;

    const newsletter = await NewsletterService.deleteNewsletter(newsletterId);

    return res.status(200).json(newsletter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.sendNewsletter = async (req, res) => {
  const { newsletterId } = req.body;
  if (!newsletterId) {
    return res
      .status(400)
      .json({ success: false, message: "Newsletter ID is required" });
  }

  try {
    const result = await NewsletterService.sendNewsletter(newsletterId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
