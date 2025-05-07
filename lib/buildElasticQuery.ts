import Mustache from "mustache";
import { z } from "zod";
import { zodToJsonSchema } from 'zod-to-json-schema';
import ollama from "ollama";
import { Client } from "@elastic/elasticsearch";

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
const extractDescriptions = (schema: typeof searchFilterSchema): { key: string; description: string }[] => {
  const shape = schema.shape;
  const output: { key: string; description: string }[] = [];
  for (const key in shape) {
    const description = (shape[key] as any)._def?.description ?? "unknown";
    output.push({ key, description });
  }
  return output;
};

const rawSystemPromptTemplate = `
You are a strict JSON converter.

Your job is to take natural language input and produce a JSON object that matches this schema:

###
{{#json_schema}}
{{key}}: {{description}}
{{/json_schema}}
###

Rules:
- Only include fields that are present or implied in the input.
- Output ONLY a plain JSON object with no explanation or formatting.
`;

const getSystemPromptForLLM = () => {
  return Mustache.render(rawSystemPromptTemplate, {
    json_schema: extractDescriptions(searchFilterSchema)
  });
};

// 🔍 Build Elasticsearch query from parsed filters
export const buildElasticQuery = (searchFilters: SearchFilters) => {
  const must = [];

  if (searchFilters.bedrooms_min || searchFilters.bedrooms_max) {
    must.push({
      range: {
        bedroom_number: {
          ...(searchFilters.bedrooms_min && { gte: searchFilters.bedrooms_min }),
          ...(searchFilters.bedrooms_max && { lte: searchFilters.bedrooms_max })
        }
      }
    });
  }

  if (searchFilters.bathrooms_min || searchFilters.bathrooms_max) {
    must.push({
      range: {
        bathroom_number: {
          ...(searchFilters.bathrooms_min && { gte: searchFilters.bathrooms_min }),
          ...(searchFilters.bathrooms_max && { lte: searchFilters.bathrooms_max })
        }
      }
    });
  }

  if (searchFilters.price_min || searchFilters.price_max) {
    must.push({
      range: {
        price: {
          ...(searchFilters.price_min && { gte: searchFilters.price_min }),
          ...(searchFilters.price_max && { lte: searchFilters.price_max })
        }
      }
    });
  }

  if (searchFilters.city) must.push({ term: { city: searchFilters.city } });
  if (searchFilters.postcode) must.push({ term: { postcode: searchFilters.postcode } });
  if (searchFilters.state) must.push({ term: { state: searchFilters.state } });

  return {
    query: {
      bool: { must }
    }
  };
};

export const generateElasticQueryFromPrompt = async (prompt: string) => {
  const response = await ollama.chat({
    model: "llama3.1:8b-instruct-q3_K_S",
    messages: [
      { role: "system", content: getSystemPromptForLLM() },
      { role: "user", content: prompt }
    ],
    options: {
      temperature: 0
    },
    format: zodToJsonSchema(searchFilterSchema)
  });

  const generatedSearchFilters = response.message.content;
  return buildElasticQuery(JSON.parse(generatedSearchFilters));
}