export const CONFIG = {

  ELASTICSEARCH_API_URL: "http://localhost:9200",

  ELASTICSEARCH_INDEX: "real_estate",

  ELASTICSEARCH_MAPPING_PATH: "lib/mapping.json",

  LANGUAGE_MODEL_NAME: "llama3.1:8b-instruct-q3_K_S",

  SYSTEM_PROMPT: `
      You are an Elasticsearch query generator. 
      Your sole purpose is to convert natural language questions into valid Elasticsearch JSON queries.
  
      CRITICAL RULES:
      1. Output ONLY valid JSON query - no explanations or conversation
      2. Generate ONLY read-only queries (GET/POST /_search)`,

  PROMPT_TEMPLATE: `
      Using this Elasticsearch mapping schema:
      ###
      {{{ schema }}}
      ###
  
      Generate a query for this question: {{{ question }}}
  
      JSON Response:`
};