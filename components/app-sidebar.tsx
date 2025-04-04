import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader
} from "@/components/ui/sidebar"

const searchResults = [
  {
    id: 1,
    Name: "The Art of War",
    Author: "Sun Tzu",
    Date: "500 BC",
    Location: "Ancient China"
  },
  {
    id: 2,
    Name: "Random Book",
    Author: "T-Visor",
    Date: "2023 44",
    Location: "United States"
  },
  {
    id: 3,
    Name: "Pride and Prejudice",
    Author: "Jane Austen",
    Date: "1813",
    Location: "England"
  },
  {
    id: 4,
    Name: "1984",
    Author: "George Orwell",
    Date: "1949",
    Location: "United Kingdom"
  },
  {
    id: 5,
    Name: "Things Fall Apart",
    Author: "Chinua Achebe",
    Date: "1958",
    Location: "Nigeria"
  },
  {
    id: 6,
    Name: "The Great Gatsby",
    Author: "F. Scott Fitzgerald",
    Date: "1925",
    Location: "United States"
  },
  {
    id: 7,
    Name: "To Kill a Mockingbird",
    Author: "Harper Lee",
    Date: "1960",
    Location: "United States"
  },
  {
    id: 8,
    Name: "One Hundred Years of Solitude",
    Author: "Gabriel García Márquez",
    Date: "1967",
    Location: "Colombia"
  },
  {
    id: 9,
    Name: "War and Peace",
    Author: "Leo Tolstoy",
    Date: "1869",
    Location: "Russia"
  },
  {
    id: 10,
    Name: "The Alchemist",
    Author: "Paulo Coelho",
    Date: "1988",
    Location: "Brazil"
  },
  {
    id: 11,
    Name: "Don Quixote",
    Author: "Miguel de Cervantes",
    Date: "1605",
    Location: "Spain"
  },
  {
    id: 12,
    Name: "The Odyssey",
    Author: "Homer",
    Date: "8th Century BC",
    Location: "Ancient Greece"
  },
  {
    id: 13,
    Name: "The Tale of Genji",
    Author: "Murasaki Shikibu",
    Date: "11th Century",
    Location: "Japan"
  },
  {
    id: 14,
    Name: "Frankenstein",
    Author: "Mary Shelley",
    Date: "1818",
    Location: "England"
  },
  {
    id: 15,
    Name: "The Divine Comedy",
    Author: "Dante Alighieri",
    Date: "1320",
    Location: "Italy"
  },
  {
    id: 16,
    Name: "The Book Thief",
    Author: "Markus Zusak",
    Date: "2005",
    Location: "Germany"
  },
  {
    id: 17,
    Name: "Norwegian Wood",
    Author: "Haruki Murakami",
    Date: "1987",
    Location: "Japan"
  },
  {
    id: 19,
    Name: "The Kite Runner",
    Author: "Khaled Hosseini",
    Date: "2003",
    Location: "Afghanistan"
  },
  {
    id: 20,
    Name: "The Little Prince",
    Author: "Antoine de Saint-Exupéry",
    Date: "1943",
    Location: "France"
  }
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center space-y-2 p-4 border-b h-13">
        <h2 className="font-medium text-white">Search Results</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col">
            {searchResults.map((result) => (
              <Button
                key={result.id}
                variant="ghost"
                className="w-full min-h-fit text-left flex flex-col items-start px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                <div className="w-full flex flex-col">
                  <span className="text-sm font-medium text-white">{result.Name}</span>
                  <span className="text-xs text-gray-400">{result.Author}</span>
                  <span className="text-xs text-gray-400">{result.Date}</span>
                  <span className="text-xs text-gray-500 italic">{result.Location}</span>
                </div>
              </Button>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
export default AppSidebar;