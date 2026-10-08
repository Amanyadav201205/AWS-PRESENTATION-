/**
 * Copies text to the clipboard. Resolves to false instead of rejecting when the Clipboard API is
 * missing (non-secure origins, some embedded browsers) or the browser denies permission.
 */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
