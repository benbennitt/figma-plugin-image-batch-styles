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
// Show the UI to get the prefix input from the user
figma.showUI(__html__, { width: 300, height: 100 });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'create-styles') {
        const prefix = msg.prefix || ''; // Get the prefix or use an empty string if none is provided
        const selectedNodes = figma.currentPage.selection;
        if (selectedNodes.length === 0) {
            figma.closePlugin("No layers selected.");
        }
        else {
            for (const [index, node] of selectedNodes.entries()) {
                if (node.type === "RECTANGLE" || node.type === "FRAME") {
                    const fills = node.fills;
                    if (fills && fills.length > 0) {
                        const imagePaints = fills.filter((fill) => fill.type === "IMAGE");
                        if (imagePaints.length > 0) {
                            // Create a style name based on the prefix and the node's name
                            const styleName = prefix + (node.name || `ImageStyle_${index + 1}`);
                            // Create a new paint style
                            const paintStyle = figma.createPaintStyle();
                            paintStyle.name = styleName;
                            paintStyle.paints = imagePaints;
                            // Apply the style back to the node asynchronously
                            yield node.setFillStyleIdAsync(paintStyle.id);
                        }
                    }
                }
            }
            figma.closePlugin("Image styles created successfully.");
        }
    }
});
