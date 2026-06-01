import JSZip from "jszip";
import type { ScaffoldFile } from "./types";

export async function downloadScaffoldAsZip(
  projectName: string,
  files: ScaffoldFile[]
): Promise<void> {
  try {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-scaffold.zip`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download scaffold:", error);
    alert("Unable to download. Please try again.");
  }
}

export async function downloadScaffoldAsJson(
  projectName: string,
  files: ScaffoldFile[]
): Promise<void> {
  try {
    const content = JSON.stringify(
      {
        projectName,
        files: files.map((f) => ({
          path: f.path,
          description: f.description,
          content: f.content,
        })),
      },
      null,
      2
    );

    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-scaffold.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download scaffold:", error);
    alert("Unable to download. Please try again.");
  }
}

export function copyScaffoldFileToClipboard(file: ScaffoldFile): void {
  const content = `# ${file.path}\n\n${file.content}`;
  navigator.clipboard.writeText(content);
}
