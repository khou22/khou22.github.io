interface CopyContent {
  text?: string;
  blob?: Blob;
}

/**
 * Copies the provided text and/or blob to the clipboard.
 * Utilizes the Clipboard API when available and falls back to document.execCommand for text.
 *
 * @param {CopyContent} content - An object containing the text and/or blob to copy.
 * @returns {Promise<void>} A promise that resolves if the copying was successful, and rejects if not.
 */
export const copyToClipboard = async (content: CopyContent): Promise<void> => {
  if (!content.text && !content.blob) {
    return Promise.reject("No content to copy");
  }

  try {
    const itemsToCopy: { [mimeType: string]: string | Blob } = {};

    // Add text to the items if provided
    if (content.text) {
      itemsToCopy["text/plain"] = content.text;
    }

    // Add blob to the items if provided
    if (content.blob) {
      itemsToCopy[content.blob.type] = content.blob;
    }

    // Use the Clipboard API to copy the items
    await navigator.clipboard.write([new ClipboardItem(itemsToCopy)]);
    return Promise.resolve();
  } catch (error) {
    // Fallback to execCommand for text if the Clipboard API fails
    if (content.text) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = content.text;
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
          return Promise.resolve();
        } else {
          return Promise.reject("Fallback: Failed to copy text");
        }
      } catch (fallbackError) {
        return Promise.reject("Fallback: Failed to copy text with execCommand");
      }
    } else {
      // If there is no text or execCommand failed, reject with the original error
      return Promise.reject("Failed to copy content: " + error);
    }
  }
};
