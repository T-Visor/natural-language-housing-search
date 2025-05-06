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
    })
  };

  if (bathrooms_min || bathrooms_max) {
    must.push({
      range: {
        bathroom_number: {
          ...(bathrooms_min && { gte: bathrooms_min }),
          ...(bathrooms_max && { lte: bathrooms_max })
        }
      }
    })
  };

  if (price_min || price_max) {
    must.push({
      range: {
        price: {
          ...(price_min && { gte: price_min }),
          ...(price_max && { lte: price_max })
        }
      }
    })
  };

  if (city) {
    must.push({
      term: {
        city: city
      }
    })
  };

  if (postcode) {
    must.push({
      term: {
        postcode: postcode
      }
    })
  };

  if (state) {
    must.push({
      term: {
        state: state
      }
    })
  };

  return {
    query: {
      bool: {
        must
      }
    }
  };
}