figma.showUI(__html__, { width: 300, height: 420, themeColors: true });

interface PluginMessage {
  type: 'create-styles';
  prefix: string;
}

function getImageLayerNames(): string[] {
  const names: string[] = [];
  for (const node of figma.currentPage.selection) {
    if (node.type === "RECTANGLE" || node.type === "FRAME") {
      const fills = node.fills as ReadonlyArray<Paint>;
      if (fills && fills.some((f) => f.type === "IMAGE")) {
        names.push(node.name || "Untitled");
      }
    }
  }
  return names;
}

function sendSelection() {
  figma.ui.postMessage({
    type: 'selection',
    layerNames: getImageLayerNames(),
  });
}

sendSelection();
figma.on('selectionchange', sendSelection);

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'create-styles') {
    const prefix = msg.prefix || '';
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.notify("No layers selected.");
      return;
    }

    let created = 0;
    for (const [index, node] of selectedNodes.entries()) {
      if (node.type === "RECTANGLE" || node.type === "FRAME") {
        const fills = node.fills as ReadonlyArray<Paint>;
        if (fills && fills.length > 0) {
          const imagePaints = fills.filter((fill) => fill.type === "IMAGE") as ImagePaint[];
          if (imagePaints.length > 0) {
            const styleName = prefix + (node.name || `ImageStyle_${index + 1}`);
            const paintStyle = figma.createPaintStyle();
            paintStyle.name = styleName;
            paintStyle.paints = imagePaints;
            await node.setFillStyleIdAsync(paintStyle.id);
            created++;
          }
        }
      }
    }

    figma.closePlugin(`Created ${created} style${created !== 1 ? 's' : ''}.`);
  }
};
