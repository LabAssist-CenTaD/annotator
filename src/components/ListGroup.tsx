import { useState } from "react";

interface ListGroupProps {
  items: string[];
  heading: string;

  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: ListGroupProps) {
  // const items = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];

  // state hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // const getMessage = () => { // Arrow function
  //   return items.length === 0 ? <p>No items</p> : null;
  // }

  // Event handler
  // const handleClick = (event: MouseEvent) => console.log(event);

  return (
    <>
      {heading && <h2>{heading}</h2>}
      {items.length === 0 && <p>No items</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
