import ListGroup from "./components/ListGroup";

function App() {
  const items = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];

  const handleSelectionItem = (item: string) => {
    console.log(item);
  }

  return <div><ListGroup items={items} heading="Cities" onSelectItem={handleSelectionItem}/></div>
}

export default App;