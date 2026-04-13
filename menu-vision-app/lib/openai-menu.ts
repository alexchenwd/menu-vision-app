import type { ScanItem, ScanRecord } from "@/data/mock-scan";

type RawMenuItem = {
  originalText: string;
  translatedName: string;
  explanation: string;
  possibleIngredients?: string[];
  priceText?: string;
  confidence?: string;
  note?: string;
  layout?: {
    top?: number;
    left?: number;
  };
};

type RawMenuResponse = {
  restaurantName?: string;
  sourceLanguage?: string;
  overallConfidence?: string;
  items?: RawMenuItem[];
};

function getApiKey() {
  return process.env.OPENAI_API_KEY;
}

function clampPercent(value: number | undefined, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return `${fallback}%`;
  }

  const clamped = Math.max(4, Math.min(78, value));
  return `${clamped}%`;
}

function normalizeConfidence(value?: string): "High" | "Medium" {
  return value?.toLowerCase().includes("high") ? "High" : "Medium";
}

function extractResponseText(payload: unknown): string {
  if (
    payload &&
    typeof payload === "object" &&
    "output_text" in payload &&
    typeof payload.output_text === "string"
  ) {
    return payload.output_text;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "output" in payload &&
    Array.isArray(payload.output)
  ) {
    const texts = payload.output
      .flatMap((item) =>
        item && typeof item === "object" && "content" in item && Array.isArray(item.content)
          ? item.content
          : []
      )
      .map((content) =>
        content && typeof content === "object" && "text" in content
          ? content.text
          : undefined
      )
      .filter((value): value is string => typeof value === "string");

    if (texts.length > 0) {
      return texts.join("\n");
    }
  }

  throw new Error("OpenAI response did not contain text output.");
}

async function generateDishImage(prompt: string, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality: "low"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image generation failed: ${errorText}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string }>;
  };

  const b64 = payload.data?.[0]?.b64_json;
  if (!b64) {
    return undefined;
  }

  return `data:image/png;base64,${b64}`;
}

export function canUseOpenAI() {
  return Boolean(getApiKey());
}

export async function analyzeMenuWithOpenAI(input: {
  fileName: string;
  imageDataUrl: string;
}): Promise<ScanRecord> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const analysisResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a menu OCR and explanation engine. Read English-language restaurant menu images and return valid JSON only. Detect likely dish names, preserve approximate overlay positions, translate into Simplified Chinese, explain dishes in plain Chinese, infer ingredients cautiously, and keep the output concise."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Analyze this menu image. Return JSON with this exact shape: {\"restaurantName\": string, \"sourceLanguage\": \"English\", \"overallConfidence\": \"Good\" | \"Mixed\", \"items\": [{\"originalText\": string, \"translatedName\": string, \"explanation\": string, \"possibleIngredients\": string[], \"priceText\": string, \"confidence\": \"High\" | \"Medium\", \"note\": string, \"layout\": {\"top\": number, \"left\": number}}]}. Use top and left as percentage anchors from 0 to 100 positioned near the dish name on the original menu. Include up to 8 visible dishes. Do not wrap the JSON in markdown."
            },
            {
              type: "input_image",
              image_url: input.imageDataUrl
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_object"
        }
      }
    })
  });

  if (!analysisResponse.ok) {
    const errorText = await analysisResponse.text();
    throw new Error(`Menu analysis failed: ${errorText}`);
  }

  const analysisPayload = await analysisResponse.json();
  const analysisText = extractResponseText(analysisPayload);
  const parsed = JSON.parse(analysisText) as RawMenuResponse;

  const rawItems = Array.isArray(parsed.items) ? parsed.items.slice(0, 8) : [];

  const normalizedItems: ScanItem[] = rawItems.map((item, index) => ({
    id: `${Date.now()}-${index}`,
    originalText: item.originalText?.trim() || `Dish ${index + 1}`,
    translatedName: item.translatedName?.trim() || "未识别菜名",
    explanation: item.explanation?.trim() || "无法可靠解释这道菜。",
    possibleIngredients:
      item.possibleIngredients?.filter(Boolean).slice(0, 6) ?? [],
    priceText: item.priceText?.trim() || "",
    imageType: "ai",
    confidence: normalizeConfidence(item.confidence),
    note: item.note?.trim() || undefined,
    layout: {
      top: clampPercent(item.layout?.top, 18 + index * 16),
      left: clampPercent(item.layout?.left, index % 2 === 0 ? 60 : 14)
    }
  }));

  const itemsWithImages = await Promise.all(
    normalizedItems.map(async (item, index) => {
      if (index >= 5) {
        return item;
      }

      try {
        const imageDataUrl = await generateDishImage(
          `Create a realistic food photo of ${item.originalText}. Show a plated dish with natural restaurant lighting. The dish should match this description: ${item.explanation}`,
          apiKey
        );

        return {
          ...item,
          imageDataUrl
        };
      } catch {
        return item;
      }
    })
  );

  return {
    id: `scan_${Date.now()}`,
    sourceLanguage: parsed.sourceLanguage || "English",
    targetLanguage: "Simplified Chinese",
    itemsFound: itemsWithImages.length,
    overallConfidence:
      parsed.overallConfidence && parsed.overallConfidence.includes("Mixed")
        ? "Mixed"
        : "Good",
    restaurantName:
      parsed.restaurantName?.trim() ||
      input.fileName.replace(/\.[^.]+$/, "") ||
      "Restaurant Menu",
    imagePreviewUrl: input.imageDataUrl,
    analysisMode: "real",
    warning:
      itemsWithImages.length > 5
        ? "Generated AI dish images for the first five detected dishes in this version."
        : undefined,
    items: itemsWithImages
  };
}
