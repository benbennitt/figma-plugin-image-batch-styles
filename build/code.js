"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 380, height: 420, themeColors: true });
function getImageLayerNames() {
    const names = [];
    for (const node of figma.currentPage.selection) {
        if (node.type === "RECTANGLE" || node.type === "FRAME") {
            const fills = node.fills;
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
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
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
                const fills = node.fills;
                if (fills && fills.length > 0) {
                    const imagePaints = fills.filter((fill) => fill.type === "IMAGE");
                    if (imagePaints.length > 0) {
                        const styleName = prefix + (node.name || `ImageStyle_${index + 1}`);
                        const paintStyle = figma.createPaintStyle();
                        paintStyle.name = styleName;
                        paintStyle.paints = imagePaints;
                        yield node.setFillStyleIdAsync(paintStyle.id);
                        created++;
                    }
                }
            }
        }
        figma.closePlugin(`Created ${created} style${created !== 1 ? 's' : ''}.`);
    }
});
