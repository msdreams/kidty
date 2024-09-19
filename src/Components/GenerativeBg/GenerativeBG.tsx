import React, { useEffect, useState } from 'react';
import './GenerativeBG.scss';

const GenerativeBG = () => {
  const shapes = ['circle', 'square', 'rectangle', 'd-shape', 't-shape'];
  const colors = ['#adb0d9', '#9bc7dc', '#cdbdda'];

  const rows = 30;
  const columns = 30;

  const [grid, setGrid] = useState(generateInitialGrid());

  function generateInitialGrid() {
    const items = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        items.push(generateRandomItem(i * columns + j, j));
      }
    }
    return items;
  }

  function generateRandomItem(key: number, columnIndex: number) {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return { type: `shape ${randomShape}`, color: randomColor, key, columnIndex };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(generateInitialGrid()); 
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="bg-container">
      <div className="bg-grid">
        {grid.map((item) => (
          <div
            key={item.key}
            className={`bg-grid-item ${item.type}`}
            style={{
              backgroundColor: item.type.startsWith('shape') ? item.color : undefined,
              color: item.type === 'letter' ? item.color : undefined,
              transitionDelay: `${item.columnIndex * 100}ms`,
            }}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerativeBG;
