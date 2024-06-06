const webContentService = require("../Service/webContent.service");

// Get web content
exports.getWebContent = async (req, res) => {
  try {
    const webContent = await webContentService.getWebContent();
    res.json(webContent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create or update web content
exports.createOrUpdateWebContent = async (req, res) => {
  try {
    const updatedWebContent = await webContentService.createOrUpdateWebContent(
      req.body
    );
    res.json(updatedWebContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
