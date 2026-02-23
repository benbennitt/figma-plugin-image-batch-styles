// Show the UI to get the prefix input from the user
figma.showUI(__html__, { width: 300, height: 100 });

// Define the message type
interface PluginMessage {
  type: 'create-styles';
  prefix: string;
}

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'create-styles') {
    const prefix = msg.prefix || '';  // Get the prefix or use an empty string if none is provided
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.closePlugin("No layers selected.");
    } else {
      for (const [index, node] of selectedNodes.entries()) {
        if (node.type === "RECTANGLE" || node.type === "FRAME") {
          const fills = node.fills as ReadonlyArray<Paint>;

          if (fills && fills.length > 0) {
            const imagePaints = fills.filter((fill) => fill.type === "IMAGE") as ImagePaint[];

            if (imagePaints.length > 0) {
              // Create a style name based on the prefix and the node's name
              const styleName = prefix + (node.name || `ImageStyle_${index + 1}`);
              
              // Create a new paint style
              const paintStyle = figma.createPaintStyle();
              paintStyle.name = styleName;
              paintStyle.paints = imagePaints;

              // Apply the style back to the node asynchronously
              await node.setFillStyleIdAsync(paintStyle.id);
            }
          }
        }
      }

      figma.closePlugin("Image styles created successfully.");
    }
  }
};
