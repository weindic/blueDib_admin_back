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
    const { emailId, users, template, status } = req.body;
    if (!emailId || !status) {
      return res
        .status(400)
        .json({ error: "emailId, and status are required fields" });
    }

    const newsletterData = {
      emailId,
      users,
      template,
      status,
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
    const { newsletterId } = req.params;
    const newsletter = await NewsletterService.getNewsletterById(newsletterId);
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
    const newsletter = await NewsletterService.updateNewsletterData(
      req.params.id,
      req.body
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
    const newsletterId = req.params.id;
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
