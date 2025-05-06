import Mustache from "mustache";
import { z } from "zod";

export const searchFilterSchema = z.object({
  price_min: z.number().optional().describe("number – Minimum listing price in USD"),
  price_max: z.number().optional().describe("number – Maximum listing price in USD"),
  bedrooms_min: z.number().optional().describe("number – Minimum number of bedrooms"),
  bedrooms_max: z.number().optional().describe("number – Maximum number of bedrooms"),
  bathrooms_min: z.number().optional().describe("number – Minimum number of bathrooms"),
  bathrooms_max: z.number().optional().describe("number – Maximum number of bathrooms"),
  city: z.string().optional().describe("string – City name to filter listings by"),
  state: z.string().optional().describe("string – Two-letter state abbreviation (e.g., MD)"),
  postcode: z.string().optional().describe("string – ZIP or postal code to filter listings by"),
});

export type SearchFilters = z.infer<typeof searchFilterSchema>;

// Extract prompt-friendly schema for Mustache
const extractDescriptions = (schema: typeof searchFilterSchema): Record<string, string> => {
  const shape = schema.shape;
  const output: Record<string, string> = {};
  for (const key in shape) {
    const description = (shape[key] as any)._def?.description ?? "unknown";
    output[key] = description;
  }
  return output;
}

const rawSystemPromptTemplate = `
You are a strict JSON converter.

Your job is to take natural language input and produce a JSON object that matches this schema:

###
{{#each json_schema}}
{{@key}}: {{this}}
{{/each}}
###

Rules:
- Only include fields that are present or implied in the input.
- Output ONLY a plain JSON object with no explanation or formatting.
`;

export const getSystemPromptForLLM = () => {
  return Mustache.render(rawSystemPromptTemplate, {
    json_schema: extractDescriptions(searchFilterSchema)
  });
};

// 🔍 Build Elasticsearch query from parsed filters
export const buildElasticQuery = ({
  price_min,
  price_max,
  bedrooms_min,
  bedrooms_max,
  bathrooms_min,
  bathrooms_max,
  city,
  state,
  postcode
}: SearchFilters) => {
  const must = [];

  if (bedrooms_min || bedrooms_max) {
    must.push({
      range: {
        bedroom_number: {
          ...(bedrooms_min && { gte: bedrooms_min }),
          ...(bedrooms_max && { lte: bedrooms_max })
        }
      }
    });
  }

  if (bathrooms_min || bathrooms_max) {
    must.push({
      range: {
        bathroom_number: {
          ...(bathrooms_min && { gte: bathrooms_min }),
          ...(bathrooms_max && { lte: bathrooms_max })
        }
      }
    });
  }

  if (price_min || price_max) {
    must.push({
      range: {
        price: {
          ...(price_min && { gte: price_min }),
          ...(price_max && { lte: price_max })
        }
      }
    });
  }

  if (city) must.push({ term: { city } });
  if (postcode) must.push({ term: { postcode } });
  if (state) must.push({ term: { state } });

  return {
    query: {
      bool: { must }
    }
  };
};