export type ScanItem = {
  id: string;
  originalText: string;
  translatedName: string;
  explanation: string;
  possibleIngredients: string[];
  priceText: string;
  imageType: "web" | "ai";
  confidence: "High" | "Medium";
  imageDataUrl?: string;
  layout: {
    top: string;
    left: string;
  };
  note?: string;
};

export type ScanRecord = {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  itemsFound: number;
  overallConfidence: string;
  restaurantName: string;
  imagePreviewUrl?: string;
  analysisMode?: "mock" | "real";
  warning?: string;
  items: ScanItem[];
};

export const mockScan: ScanRecord = {
  id: "scan_demo_001",
  sourceLanguage: "English",
  targetLanguage: "Simplified Chinese",
  itemsFound: 12,
  overallConfidence: "Good",
  restaurantName: "Harbor House Grill",
  imagePreviewUrl: undefined,
  analysisMode: "mock",
  items: [
    {
      id: "fish-and-chips",
      originalText: "Fish and Chips",
      translatedName: "炸鱼薯条",
      explanation: "英式炸鱼配薯条，通常搭配塔塔酱和柠檬。",
      possibleIngredients: ["cod", "potato", "batter", "tartar sauce"],
      priceText: "$18",
      imageType: "web",
      confidence: "High",
      layout: { top: "18%", left: "61%" }
    },
    {
      id: "chicken-fried-steak",
      originalText: "Chicken Fried Steak",
      translatedName: "炸鸡排风味牛排",
      explanation: "美国南方菜，通常是裹粉牛排油炸后搭配肉汁。",
      possibleIngredients: ["beef steak", "flour coating", "pepper gravy"],
      priceText: "$21",
      imageType: "ai",
      confidence: "Medium",
      layout: { top: "39%", left: "58%" },
      note: "名字容易误导，这道菜通常是牛肉，不是鸡肉。"
    },
    {
      id: "clam-chowder",
      originalText: "Clam Chowder",
      translatedName: "蛤蜊浓汤",
      explanation: "奶油底浓汤，常见于美国东海岸海鲜餐厅。",
      possibleIngredients: ["clam", "cream", "potato", "celery"],
      priceText: "$9",
      imageType: "web",
      confidence: "High",
      layout: { top: "70%", left: "13%" }
    }
  ]
};
