const fetchSearchResults = async () => {
  const results = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/housing-search`,
                              { cache: "no-store" })
  if (!results.ok) {
    throw new Error("Failed to fetch search results");
  }

  return results.json();
}

export default fetchSearchResults;