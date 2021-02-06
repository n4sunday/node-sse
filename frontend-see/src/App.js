import React, { useEffect, useState } from 'react'

const useEventSource = (url) => {
  const [data, updateData] = useState(null);

  useEffect(() => {
    const source = new EventSource(url);
    source.onmessage = function logEvents(event) {
      updateData(JSON.parse(event.data));
    }
  }, [])

  return data;
}

function App() {
  const data = useEventSource('http://localhost:3000/random');

  if (!data) {
    return <div />
  }

  return <div>{data.value}</div>
}

export default App