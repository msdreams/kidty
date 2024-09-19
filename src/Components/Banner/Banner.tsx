import React, { useEffect, useState } from 'react';
import './Banner.scss';
import { avatars } from '../../Utils/kit';

const Banner = () => {
  const letters = ['K', 'I', 'D', 'T', 'Y'];
  const shapes = ['circle', 'square', 'rectangle', 'd-shape', 't-shape'];
  const colors = ['#6771DE', '#C88CF8', '#50C3F9', '#6c6e90'];
  const rows = 10;
  const columns = 5;

  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
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
    const randomType = Math.random();

    if (randomType < 0.33) {
      const letterIndex = key % letters.length;
      const randomLetter = letters[letterIndex];
      return { type: 'letter', content: randomLetter, color: '#6c6e90', key, columnIndex };
    } else if (randomType < 0.66) {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      return { type: `shape ${randomShape}`, color: randomColor, key, columnIndex };
    } else {
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      return { type: 'avatar', src: randomAvatar, key, columnIndex };
    }
  }
  

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) { 
      setAnimationDirection(prev => prev === 'up' ? 'down' : 'up');
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(generateInitialGrid()); 
    }, 5000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <div
      className="banner-container"
      onMouseDown={handleMouseDown}
    >
      <div className="grid">
        {generateInitialGrid().map((item) => (
          <div
            key={item.key}
            className={`grid-item ${item.type}`}
            style={{
              backgroundColor: item.type.startsWith('shape') ? item.color : undefined,
              color: item.type === 'letter' ? item.color : undefined, // Цвет для букв
              transitionDelay: `${item.columnIndex * 100}ms`,
            }}
          >
            {item.type === 'letter' && item.content}
            {item.type === 'avatar' && (
              <img src={item.src} alt="Avatar" className="avatar" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;

