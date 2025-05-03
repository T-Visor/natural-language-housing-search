import Mustache from "mustache";
import { readFile } from "fs/promises";
import ollama from "ollama";
import { CONFIG } from "./config";
import { Client } from "@elastic/elasticsearch";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Queries Elasticsearch using a natural language prompt.
 * 
 * @param {string} query - Natural language query input from the user.
 * 
 * @returns {Promise<any[]>} Array of Elasticsearch search hits.
 */
export const queryElasticUsingNaturalLanguage = async (query: string) => {
  const elasticsearchMapping = await loadJsonFromFile(CONFIG.ELASTICSEARCH_MAPPING_PATH);
  const prompt = buildPrompt(CONFIG.PROMPT_TEMPLATE, elasticsearchMapping, query);
  const elasticQuery = await generateElasticQueryFromPrompt(prompt);
  console.log(elasticQuery);
  const elasticQueryAsJSON = JSON.parse(elasticQuery);

  const client = new Client({
    node: process.env.ELASTICSEARCH_API_URL,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME!,
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },
  });

  const searchResults = await client.search({
    index: CONFIG.ELASTICSEARCH_INDEX,
    body: elasticQueryAsJSON, 
    size: 100
  }, { meta: true });

  return searchResults.body.hits.hits;
};

/**
 * Loads a JSON file from the local filesystem.
 * 
 * @param {string} jsonFilePath - Path to the JSON file.
 * 
 * @returns {Promise<any>} Parsed JSON object.
 */
const loadJsonFromFile = async (jsonFilePath: string) => {
  const fileContents = await readFile(jsonFilePath, "utf-8");
  return JSON.parse(fileContents);
};

/**
 * Builds a prompt string using Mustache templating.
 * 
 * @param {string} promptTemplate - The Mustache template string.
 * @param {any} jsonMapping - The Elasticsearch mapping schema.
 * @param {string} userQuery - The user’s natural language query.
 * 
 * @returns {string} The rendered prompt.
 */
const buildPrompt = (promptTemplate: string, jsonMapping: any, userQuery: string) => {
  const promptTemplateVariables = {
    schema: JSON.stringify(jsonMapping, null, 2),
    question: userQuery
  };

  return Mustache.render(promptTemplate, promptTemplateVariables);
};

/**
 * Generates an Elasticsearch query using a language model (Ollama).
 * 
 * @param {string} prompt - The formatted prompt string.
 * 
 * @returns {Promise<string>} The generated Elasticsearch query as a JSON string.
 */
const generateElasticQueryFromPrompt = async (prompt: string) => {
  const ElasticQuerySchema = z.object({
    query: z.object({}).passthrough(), // allow nested objects like match, bool, etc.
  });

  const response = await ollama.chat({
    model: CONFIG.LANGUAGE_MODEL_NAME,
    messages: [
      { role: "system", content: CONFIG.SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
    options: {
      temperature: 0
    },
    format: zodToJsonSchema(ElasticQuerySchema)
  });

  return response.message.content;
};