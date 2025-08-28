export interface ImageAnalyzeResponse {
  ok: boolean;
  data: ImageAnalyze;
}

export interface ImageAnalyze {
  title: string;
  category: string;
  type: string;
  brand: string;
  model: string;
  colors: string;
  material: string;
  size: string;
  condition: string;
  identifiable_features: string;
  contents: string;
  description: string;
}
