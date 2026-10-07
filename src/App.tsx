import { Button, TextField } from '@mui/material';
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const handleClick = () => {
    alert(`${name} さん、ボタン押したらアカン！`);
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        MUIコンポーネントの練習
      </h1>

      <div className="flex flex-row gap-4">
        <TextField
          label="名前を入れろゆーてるやろが"
          variant="outlined"
          placeholder="名前を入力してください"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="outlined" onClick={handleClick}>
          クリック
        </Button>
      </div>
    </div>
  );
}

export default App;