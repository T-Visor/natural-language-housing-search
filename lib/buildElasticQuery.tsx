import Mustache from "mustache";

type SearchFilters = {
  price_min?: number;
  price_max?: number;
  bedrooms_min?: number;
  bedrooms_max?: number;
  bathrooms_min?: number;
  bathrooms_max?: number;
  city?: string;
  state?: string;
  postcode?: string;
};

// Tool schema used for LLM structured output
export const searchFilterSchema = {
  price_min: "number",
  price_max: "number",
  bedrooms_min: "number",
  bedrooms_max: "number",
  bathrooms_min: "number",
  bathrooms_max: "number",
  city: "string",
  state: "string (2-letter code, e.g., MD)",
  postcode: "string"
};

const rawSystemPromptTemplate = `
You are a strict JSON converter.

Your job is to take natural language input and produce a JSON object that matches this schema:

###
{{{json_schema}}}
###

Rules:
- Only include fields that are present or implied in the input.
- Output ONLY a plain JSON object.
`;

export const getSystemPromptForLLM = () =>
  Mustache.render(rawSystemPromptTemplate, {
    json_schema: JSON.stringify(searchFilterSchema, null, 2)
  });

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

  if (city) {
    must.push({ term: { city } });
  }

  if (postcode) {
    must.push({ term: { postcode } });
  }

  if (state) {
    must.push({ term: { state } });
  }

  return {
    query: {
      bool: { must }
    }
  };
};