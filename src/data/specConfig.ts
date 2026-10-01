import type { CategoryId, SpecField } from "../types";

/**
 * SPEC CONFIG — the single source of truth for how each spec is compared.
 *
 * "Best" means something different per field:
 *   • price / weight / thickness  → LOWER is better
 *   • rating / battery / RAM / MP → HIGHER is better
 *   • processor / codecs / ports  → subjective text, NO winner
 *   • booleans (5G, ANC, …)       → `true` wins when `better: "higher"`
 *
 * Rather than hard-coding per-field logic in the comparison table, every
 * field declares its own `better` direction here. `utils/compare.ts` then
 * applies one generic algorithm driven by this config.
 */

/** Fields every category shares — always rendered first. */
const COMMON_FIELDS: SpecField[] = [
  { key: "price", label: "Price", type: "currency", better: "lower", group: "Overview", hint: "Lower is better" },
  { key: "rating", label: "User rating", type: "rating", better: "higher", group: "Overview", hint: "Higher is better" },
];

const SMARTPHONE_FIELDS: SpecField[] = [
  ...COMMON_FIELDS,
  { key: "releaseYear", label: "Released", type: "number", better: "none", group: "Overview" },
  // Display
  { key: "displaySize", label: "Screen size", type: "number", unit: '"', better: "none", group: "Display", hint: "Preference — not scored" },
  { key: "resolution", label: "Resolution", type: "text", better: "none", group: "Display" },
  { key: "refreshRate", label: "Refresh rate", type: "number", unit: "Hz", better: "higher", group: "Display" },
  { key: "brightness", label: "Peak brightness", type: "number", unit: "nits", better: "higher", group: "Display" },
  // Performance
  { key: "processor", label: "Processor", type: "text", better: "none", group: "Performance" },
  { key: "ram", label: "RAM", type: "number", unit: "GB", better: "higher", group: "Performance" },
  { key: "storage", label: "Storage", type: "number", unit: "GB", better: "higher", group: "Performance" },
  // Camera
  { key: "mainCamera", label: "Main camera", type: "number", unit: "MP", better: "higher", group: "Camera" },
  { key: "opticalZoom", label: "Optical zoom", type: "number", unit: "×", better: "higher", group: "Camera" },
  { key: "frontCamera", label: "Front camera", type: "number", unit: "MP", better: "higher", group: "Camera" },
  { key: "videoMax", label: "Max video", type: "text", better: "none", group: "Camera" },
  // Battery
  { key: "battery", label: "Battery", type: "number", unit: "mAh", better: "higher", group: "Battery & Charging" },
  { key: "wiredCharging", label: "Wired charging", type: "number", unit: "W", better: "higher", group: "Battery & Charging" },
  { key: "wirelessCharging", label: "Wireless charging", type: "boolean", better: "higher", group: "Battery & Charging" },
  // Build
  { key: "weight", label: "Weight", type: "number", unit: "g", better: "lower", group: "Build & Extras", hint: "Lighter is better" },
  { key: "waterResistance", label: "Water resistance", type: "text", better: "none", group: "Build & Extras" },
  { key: "fiveG", label: "5G", type: "boolean", better: "higher", group: "Build & Extras" },
  { key: "warranty", label: "Warranty", type: "number", unit: "yr", better: "higher", group: "Build & Extras" },
];

const LAPTOP_FIELDS: SpecField[] = [
  ...COMMON_FIELDS,
  { key: "releaseYear", label: "Released", type: "number", better: "none", group: "Overview" },
  // Display
  { key: "displaySize", label: "Screen size", type: "number", unit: '"', better: "none", group: "Display", hint: "Preference — not scored" },
  { key: "resolution", label: "Resolution", type: "text", better: "none", group: "Display" },
  { key: "panel", label: "Panel", type: "text", better: "none", group: "Display" },
  { key: "refreshRate", label: "Refresh rate", type: "number", unit: "Hz", better: "higher", group: "Display" },
  { key: "brightness", label: "Brightness", type: "number", unit: "nits", better: "higher", group: "Display" },
  // Performance
  { key: "processor", label: "Processor", type: "text", better: "none", group: "Performance" },
  { key: "gpu", label: "Graphics", type: "text", better: "none", group: "Performance" },
  { key: "ram", label: "RAM", type: "number", unit: "GB", better: "higher", group: "Performance" },
  { key: "storage", label: "Storage", type: "number", unit: "GB", better: "higher", group: "Performance" },
  // Battery
  { key: "batteryLife", label: "Battery life", type: "number", unit: "hrs", better: "higher", group: "Battery & Charging" },
  { key: "chargingWatts", label: "Charger", type: "number", unit: "W", better: "higher", group: "Battery & Charging" },
  // Build
  { key: "weight", label: "Weight", type: "number", unit: "kg", better: "lower", group: "Build & Extras", hint: "Lighter is better" },
  { key: "thickness", label: "Thickness", type: "number", unit: "mm", better: "lower", group: "Build & Extras", hint: "Thinner is better" },
  { key: "ports", label: "Ports", type: "text", better: "none", group: "Build & Extras" },
  { key: "webcam", label: "Webcam", type: "text", better: "none", group: "Build & Extras" },
  { key: "os", label: "Operating system", type: "text", better: "none", group: "Build & Extras" },
  { key: "warranty", label: "Warranty", type: "number", unit: "yr", better: "higher", group: "Build & Extras" },
];

const HEADPHONE_FIELDS: SpecField[] = [
  ...COMMON_FIELDS,
  { key: "type", label: "Form factor", type: "text", better: "none", group: "Overview" },
  // Audio
  { key: "driverSize", label: "Driver size", type: "number", unit: "mm", better: "higher", group: "Audio" },
  { key: "noiseCancelling", label: "Active noise cancelling", type: "boolean", better: "higher", group: "Audio" },
  { key: "transparencyMode", label: "Transparency mode", type: "boolean", better: "higher", group: "Audio" },
  { key: "spatialAudio", label: "Spatial audio", type: "boolean", better: "higher", group: "Audio" },
  { key: "codecs", label: "Codecs", type: "text", better: "none", group: "Audio" },
  // Battery
  { key: "batteryLife", label: "Battery life", type: "number", unit: "hrs", better: "higher", group: "Battery & Charging" },
  { key: "quickCharge", label: "Quick charge", type: "text", better: "none", group: "Battery & Charging" },
  { key: "chargingPort", label: "Charging", type: "text", better: "none", group: "Battery & Charging" },
  // Connectivity
  { key: "bluetooth", label: "Bluetooth", type: "number", better: "higher", group: "Connectivity", hint: "Newer version is better" },
  { key: "multipoint", label: "Multipoint pairing", type: "boolean", better: "higher", group: "Connectivity" },
  { key: "wiredOption", label: "Wired listening", type: "boolean", better: "higher", group: "Connectivity" },
  // Build
  { key: "weight", label: "Weight", type: "number", unit: "g", better: "lower", group: "Build & Extras", hint: "Lighter is better" },
  { key: "waterResistance", label: "Water resistance", type: "text", better: "none", group: "Build & Extras" },
  { key: "foldable", label: "Foldable", type: "boolean", better: "higher", group: "Build & Extras" },
  { key: "warranty", label: "Warranty", type: "number", unit: "yr", better: "higher", group: "Build & Extras" },
];

const CAMERA_FIELDS: SpecField[] = [
  ...COMMON_FIELDS,
  { key: "releaseYear", label: "Released", type: "number", better: "none", group: "Overview" },
  // Sensor
  { key: "sensorType", label: "Sensor", type: "text", better: "none", group: "Sensor" },
  { key: "megapixels", label: "Resolution", type: "number", unit: "MP", better: "higher", group: "Sensor" },
  { key: "isoMax", label: "Max ISO", type: "number", better: "higher", group: "Sensor" },
  { key: "dynamicRange", label: "Dynamic range", type: "number", unit: "stops", better: "higher", group: "Sensor" },
  // Shooting
  { key: "burstSpeed", label: "Burst speed", type: "number", unit: "fps", better: "higher", group: "Shooting" },
  { key: "autofocusPoints", label: "AF points", type: "number", better: "higher", group: "Shooting" },
  { key: "stabilization", label: "In-body stabilization", type: "boolean", better: "higher", group: "Shooting" },
  { key: "viewfinder", label: "Viewfinder", type: "text", better: "none", group: "Shooting" },
  // Video
  { key: "videoResolution", label: "Max video", type: "text", better: "none", group: "Video" },
  { key: "videoFps", label: "Max 4K frame rate", type: "number", unit: "fps", better: "higher", group: "Video" },
  { key: "logProfile", label: "Log profile", type: "boolean", better: "higher", group: "Video" },
  // Build
  { key: "battery", label: "Battery", type: "number", unit: "shots", better: "higher", group: "Build & Extras" },
  { key: "weight", label: "Weight", type: "number", unit: "g", better: "lower", group: "Build & Extras", hint: "Lighter is better" },
  { key: "weatherSealed", label: "Weather sealed", type: "boolean", better: "higher", group: "Build & Extras" },
  { key: "dualCardSlots", label: "Dual card slots", type: "boolean", better: "higher", group: "Build & Extras" },
  { key: "warranty", label: "Warranty", type: "number", unit: "yr", better: "higher", group: "Build & Extras" },
];

export const SPEC_FIELDS: Record<CategoryId, SpecField[]> = {
  smartphones: SMARTPHONE_FIELDS,
  laptops: LAPTOP_FIELDS,
  headphones: HEADPHONE_FIELDS,
  cameras: CAMERA_FIELDS,
};

/** Convenience: look up a field definition by key for a category. */
export function getField(categoryId: CategoryId, key: string): SpecField | undefined {
  return SPEC_FIELDS[categoryId].find((f) => f.key === key);
}
