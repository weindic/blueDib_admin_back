const WebContent = require("../Model/webContent.model");

// Get web content
exports.getWebContent = async () => {
  const webContent = await WebContent.findOne();
  return webContent;
};

// Create or update web content
exports.createOrUpdateWebContent = async (data) => {
  let webContent = await WebContent.findOne();
  if (webContent) {
    Object.assign(webContent, data);
    webContent.updatedAt = Date.now();
  } else {
    webContent = new WebContent(data);
  }
  return await webContent.save();
};
