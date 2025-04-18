import pandas as pd
import json
from datetime import datetime
from elasticsearch import Elasticsearch, helpers, exceptions
import logging
import simplejson as json  # swap standard json with simplejson

# === Elasticsearch Config ===
ES_HOST = 'http://localhost:9200'
ES_USERNAME = 'elastic'
ES_PASSWORD = 'K3ggKtqv'
INDEX_NAME = 'real_estate'
CSV_INPUT = 'data/input_file.csv'
MAPPING_FILE = 'real_estate_index_mapping.json'

# === Logging ===
logging.basicConfig(level=logging.INFO)
logging.getLogger("elasticsearch").setLevel(logging.DEBUG)

# === Step 1: Connect to ES ===
es = Elasticsearch(
    ES_HOST,
    basic_auth=(ES_USERNAME, ES_PASSWORD),
    verify_certs=False
)

# === Step 2: Load Mapping and Create Index ===
with open(MAPPING_FILE, 'r') as f:
    mapping = json.load(f)

if es.indices.exists(index=INDEX_NAME):
    print(f"ℹ️ Index '{INDEX_NAME}' already exists. Deleting and recreating it.")
    es.indices.delete(index=INDEX_NAME)

print(f"🚀 Creating index '{INDEX_NAME}'...")
es.indices.create(index=INDEX_NAME, body=mapping)

# === Step 3: Load and Clean Data ===
df = pd.read_csv(CSV_INPUT)

def safe_location(row):
    if pd.notnull(row['latitude']) and pd.notnull(row['longitude']):
        return {'lat': row['latitude'], 'lon': row['longitude']}
    return None

df['location'] = df.apply(safe_location, axis=1)
df.drop(columns=['latitude', 'longitude'], inplace=True)

df['RunDate'] = pd.to_datetime(df['RunDate'], errors='coerce').dt.strftime('%Y-%m-%d %H:%M:%S')

df.fillna({
    'apartment': 'N/A',
    'broker_id': 'N/A',
    'agent_name': 'N/A',
    'agent_phone': 'N/A',
    'year_build': -1,
    'total_num_units': -1
}, inplace=True)

df['is_owned_by_zillow'] = df['is_owned_by_zillow'].apply(lambda x: bool(int(x)) if pd.notnull(x) else False)

# Final safety sweep — replace any other NaN with None to avoid JSON NaN serialization
df = df.where(pd.notnull(df), None)

records = df.to_dict(orient='records')

# === Step 4: Validation ===
invalid_records = []

def validate_record(record):
    errors = []

    if not isinstance(record.get("location"), dict):
        errors.append("Missing or invalid 'location' field")
    else:
        try:
            float(record["location"]["lat"])
            float(record["location"]["lon"])
        except:
            errors.append("Latitude/longitude not floats")

    try:
        datetime.strptime(record.get("RunDate", ""), '%Y-%m-%d %H:%M:%S')
    except:
        errors.append("Invalid 'RunDate' format")

    return errors


def generate_bulk_actions(index_name, docs):
    for i, doc in enumerate(docs):
        errors = validate_record(doc)

        # Final validation catch — skip NaN floats that may sneak through
        for k, v in doc.items():
            if isinstance(v, float) and (pd.isna(v) or v != v):  # NaN check
                doc[k] = None

        if errors:
            invalid_records.append({'index': i, 'errors': errors, 'record': doc})
            continue

        # Serialize safely with NaN skipping
        yield {
            "_index": index_name,
            "_source": json.loads(json.dumps(doc, ignore_nan=True))  # ← removes NaN, inf, -inf
        }

# === Step 5: Bulk Indexing ===
try:
    print(f"📦 Indexing {len(records)} records in bulk...")
    success, failed = helpers.bulk(es, generate_bulk_actions(INDEX_NAME, records), stats_only=True)
    print(f"✅ Successfully indexed: {success}")
    print(f"❌ Failed to index: {failed}")
except helpers.BulkIndexError as e:
    print(f"❌ Bulk indexing error: {len(e.errors)} failed documents.")
    with open("bulk_failed_docs.json", "w") as f:
        json.dump(e.errors, f, indent=2)
    print("📄 Details saved to bulk_failed_docs.json")

# === Step 6: Save Skipped Invalid Records ===
if invalid_records:
    with open("skipped_invalid_records.json", "w") as f:
        json.dump(invalid_records, f, indent=2)
    print(f"⚠️ Skipped {len(invalid_records)} records due to validation errors.")
    print("📄 Details saved to skipped_invalid_records.json")

