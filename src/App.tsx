import Message from './message';

function App() {
  const name = 'wattesigma';
  if (name)
    return (
      <div>
        <h1>Hello {name}</h1>
      </div>
    );
  return <Message />;
}

export default App;