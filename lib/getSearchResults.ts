import useSearchResultsStore from "@/store/useSearchResultsStore"

const setSearchResults = useSearchResultsStore.getState().setSearchResults;

const getSearchResults = async () => {
  const results = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/housing-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: {
        "match_all": {}
      },
      size: 30
    })
  });

  if (!results.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = await results.json();
  setSearchResults(data);
}

export default getSearchResults;