import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Popup } from "react-leaflet";
import isEqual from 'lodash/isEqual';

const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(number);
}

export const ListingButtonCard = ({
  result,
  searchResult,
  searchResultReference,
  setSearchResult
}) => {
  const coordinates: [number, number] = [
    result._source.location.lat, 
    result._source.location.lon
  ];

  return (
    <div
      key={result._id}
      className="flex flex-col w-full rounded-md overflow-hidden"
    >
      {/* Highlight this button if its coordinates match the currently selected location */}
      <Button
        variant={isEqual(searchResult, coordinates) ? "secondary" : "ghost"}
        ref={isEqual(searchResult, coordinates) ? searchResultReference : null}
        onClick={() => setSearchResult(coordinates)}
        className="w-full h-auto text-left flex flex-col items-start py-2 rounded-md hover:bg-gray-800"
      >
        <div className="w-full flex justify-center">
          <Image
            className="rounded-md"
            src="/P5_ProtagonistHouseConceptArt.png"
            width={800}
            height={800}
            alt="Blank image placeholder"
          />
        </div>
        <div className="w-full flex flex-col">
          <span className="text-base font-large font-bold text-white mb-1">
            {`${formatCurrency(result._source.price)}`}
          </span>
          <span className="text-sm text-gray-400 mb-0.5">
            {`${result._source.bedroom_number ?? 0} bed | 
              ${result._source.bathroom_number ?? 0} bath`}
          </span>
          <span className="text-sm text-gray-400 mb-0.5 truncate whitespace-pre-line">
            {result._source.address}
          </span>
          <a
            className="text-sm text-blue-500"
            href={result._source.property_url}
            target="_blank"
          >
            View Source
          </a>
        </div>
      </Button>
    </div>
  )
}

export const ListingPopupForLeafletMarker = ({ result }) => {
  return (
    <Popup>
      <div className="w-50 h-auto text-left flex flex-col items-start py-2 rounded-md px-3 bg-gray-800">
        <div className="w-full flex justify-center pb-2">
          <Image
            className="rounded-md"
            src="/P5_ProtagonistHouseConceptArt.png"
            width={800}
            height={800}
            alt="Blank image placeholder"
          />
        </div>
        <div className="w-full flex flex-col">
          <span className="text-base font-large font-bold text-white mb-1">
            {`${formatCurrency(result._source.price)}`}
          </span>
          <span className="text-sm text-gray-400 mb-0.5">
            {`${result._source.bedroom_number ?? 0} bed | 
              ${result._source.bathroom_number ?? 0} bath`}
          </span>
          <span className="text-sm text-gray-400 mb-0.5 truncate whitespace-pre-line">
            {result._source.address}
          </span>
          <a
            className="text-sm text-blue-500"
            href={result._source.property_url}
            target="_blank"
          >
            View Source
          </a>
        </div>
      </div>
    </Popup>
  );
}