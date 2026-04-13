import { mockScan, type ScanRecord } from "@/data/mock-scan";
import { analyzeMenuWithOpenAI, canUseOpenAI } from "@/lib/openai-menu";

const scans = new Map<string, ScanRecord>([[mockScan.id, mockScan]]);

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildItemsFromFileName(fileName: string): ScanRecord["items"] {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const normalized = slugifyName(baseName || "daily-special");

  return [
    {
      id: `${normalized}-1`,
      originalText: baseName || "House Special Burger",
      translatedName: "招牌汉堡",
      explanation: "美式主菜，通常包含牛肉饼、生菜、番茄和酱汁。",
      possibleIngredients: ["beef patty", "bun", "lettuce", "tomato"],
      priceText: "$16",
      imageType: "web",
      confidence: "High",
      layout: { top: "18%", left: "60%" }
    },
    {
      id: `${normalized}-2`,
      originalText: "Truffle Fries",
      translatedName: "松露薯条",
      explanation: "薯条拌松露风味调味料，通常搭配帕玛森芝士。",
      possibleIngredients: ["potato", "truffle oil", "parmesan"],
      priceText: "$11",
      imageType: "ai",
      confidence: "Medium",
      layout: { top: "44%", left: "58%" }
    },
    {
      id: `${normalized}-3`,
      originalText: "New England Chowder",
      translatedName: "新英格兰浓汤",
      explanation: "奶油底海鲜浓汤，常见食材包括蛤蜊和土豆。",
      possibleIngredients: ["clam", "cream", "potato", "celery"],
      priceText: "$9",
      imageType: "web",
      confidence: "High",
      layout: { top: "70%", left: "14%" }
    }
  ];
}

export function listScans() {
  return Array.from(scans.values());
}

export function getScanById(id: string) {
  return scans.get(id);
}

export async function createScan(input: {
  fileName: string;
  imagePreviewUrl?: string;
}) {
  if (input.imagePreviewUrl && canUseOpenAI()) {
    try {
      const realScan = await analyzeMenuWithOpenAI({
        fileName: input.fileName,
        imageDataUrl: input.imagePreviewUrl
      });
      scans.set(realScan.id, realScan);
      return realScan;
    } catch {
      // Fall back to mock generation so the product remains usable.
    }
  }

  const id = `scan_${Date.now()}`;
  const fileBaseName = input.fileName.replace(/\.[^.]+$/, "") || "Restaurant Menu";

  const scan: ScanRecord = {
    id,
    sourceLanguage: "English",
    targetLanguage: "Simplified Chinese",
    itemsFound: 3,
    overallConfidence: "Good",
    restaurantName: fileBaseName,
    imagePreviewUrl: input.imagePreviewUrl,
    analysisMode: "mock",
    warning: canUseOpenAI()
      ? "OpenAI analysis failed for this image, so a mocked fallback result was used."
      : "Set OPENAI_API_KEY to enable real menu analysis and AI dish image generation.",
    items: buildItemsFromFileName(input.fileName)
  };

  scans.set(id, scan);
  return scan;
}
