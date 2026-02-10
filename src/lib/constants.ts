export const USE_CASES = [
  "Product photo",
  "Cinematic video",
  "Ad creative",
  "Social media",
  "Portrait",
  "Landscape",
  "Abstract art",
  "Architecture",
  "Food photography",
  "Fashion",
] as const;

export const STYLES = [
  "Photorealistic",
  "Cinematic",
  "Anime",
  "Watercolor",
  "3D Render",
  "Oil painting",
  "Digital art",
  "Minimalist",
  "Surreal",
  "Vintage",
] as const;

export const MOODS = [
  "Dramatic",
  "Serene",
  "Energetic",
  "Mysterious",
  "Joyful",
  "Melancholic",
  "Ethereal",
  "Dark",
  "Warm",
  "Cool",
] as const;

export const CAMERAS = [
  "Close-up",
  "Wide angle",
  "Bird's eye",
  "Low angle",
  "Dutch angle",
  "Over the shoulder",
  "Macro",
  "Panoramic",
] as const;

export const ASPECT_RATIOS = [
  { label: "1:1 (Square)", value: "1:1" },
  { label: "16:9 (Widescreen)", value: "16:9" },
  { label: "9:16 (Portrait)", value: "9:16" },
  { label: "4:3 (Standard)", value: "4:3" },
  { label: "3:2 (Photo)", value: "3:2" },
] as const;

export const LIGHTING_TYPES = [
  "Natural",
  "Studio",
  "Golden hour",
  "Neon",
  "Dramatic",
  "Soft",
  "Backlit",
  "Rim lighting",
] as const;

export type PromptFormData = {
  outputType: "image" | "video";
  useCase: string;
  subject: string;
  style: string;
  mood: string;
  camera: string;
  aspectRatio: string;
  seed: string;
  lighting: string;
  realismLevel: number;
  negativePrompt: string;
};

export const DEFAULT_FORM_DATA: PromptFormData = {
  outputType: "image",
  useCase: "",
  subject: "",
  style: "",
  mood: "",
  camera: "",
  aspectRatio: "16:9",
  seed: "",
  lighting: "",
  realismLevel: 70,
  negativePrompt: "",
};

export const FREE_DAILY_LIMIT = 5;
