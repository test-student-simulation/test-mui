import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Rating,
  Switch,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Badge,
  Slider,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useEffect, useState } from 'react';

type Game = {
  id: string;
  title: string;
  platform: string;
  status: string;
  rating: number | null;
  playTime: number;
  favorite: boolean;
};

function App() {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('未プレイ');
  const [rating, setRating] = useState<number | null>(0);
  const [favorite, setFavorite] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>(() => {
    const savedGames = localStorage.getItem('games');
    return savedGames ? JSON.parse(savedGames) : [];
  });
  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('すべて');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [playTime, setPlayTime] = useState(0);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setPlatform('');
    setStatus('未プレイ');
    setRating(0);
    setPlayTime(0);
    setFavorite(false);
  };

  return (
    <div className="flex flex-col gap-4 max-w-md px-3 py-3">
      <h1 className="text-2xl font-bold mb-6">
        ゲーム管理
      </h1>

      <TextField
        label="ゲームタイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormControl>
        <InputLabel>プラットフォーム</InputLabel>

        <Select
          value={platform}
          label="プラットフォーム"
          onChange={(e) => setPlatform(e.target.value)}
        >
          <MenuItem value="Switch">Switch</MenuItem>
          <MenuItem value="PS5">PS5</MenuItem>
          <MenuItem value="PC">PC</MenuItem>
          <MenuItem value="スマートフォン">スマートフォン</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>プレイ状況</FormLabel>

        <RadioGroup
          row
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <FormControlLabel
            value="未プレイ"
            control={<Radio />}
            label="未プレイ"
          />
          <FormControlLabel
            value="プレイ中"
            control={<Radio />}
            label="プレイ中"
          />
          <FormControlLabel
            value="クリア"
            control={<Radio />}
            label="クリア"
          />
        </RadioGroup>
      </FormControl>
      <div>
        <FormLabel>評価</FormLabel>
        <Rating
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
        />
      </div>
      <div>
        <FormLabel>プレイ時間：{playTime}時間</FormLabel>
        <Tooltip title="これまでにプレイした合計時間を設定します">
          <Slider
            value={playTime}
            onChange={(_, value) => setPlayTime(value as number)}
            min={0}
            max={100}
            step={1}
          />
        </Tooltip>
      </div>
      <FormControlLabel
        control={
          <Switch
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
          />
        }
        label="お気に入り"
      />
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        onClick={() => {
          if (title.trim() === '') {
            setError('ゲームタイトルを入力してください');
            return;
          }
          setError('');
          if (editId !== null) {
            // 編集
            setGames(
              games.map((game) =>
                game.id === editId
                  ? {
                    ...game,
                    title,
                    platform,
                    status,
                    rating,
                    playTime,
                    favorite,
                  }
                  : game
              )
            );

            setEditId(null);
            setMessage('ゲームを更新しました');
          } else {
            // 新規登録
            const newGame: Game = {
              id: crypto.randomUUID(),
              title,
              platform,
              status,
              rating,
              playTime,
              favorite,
            };

            setGames([...games, newGame]);
            setMessage('ゲームを登録しました');
          }
          resetForm();
        }}
      >
        {editId !== null ? '更新' : '登録'}
      </Button>
      {editId !== null && (
        <Button
          onClick={() => { resetForm(); }}
        >
          編集をキャンセル
        </Button>
      )}

      <div className="flex items-center gap-2">
        <Typography variant="h6">
          ゲーム一覧
        </Typography>

        <Chip
          label={games.length}
          size="small"
          color="primary"
        />
        <Badge
          badgeContent={games.length}
          color="primary"
        >
          <span>登録数</span>
        </Badge>
      </div>

      <Tabs
        value={filter}
        onChange={(_, newValue) => setFilter(newValue)}
      >
        <Tab label="すべて" value="すべて" />
        <Tab label="未プレイ" value="未プレイ" />
        <Tab label="プレイ中" value="プレイ中" />
        <Tab label="クリア" value="クリア" />
      </Tabs>
      <FormControlLabel
        control={
          <Switch
            checked={favoriteOnly}
            onChange={(e) => setFavoriteOnly(e.target.checked)}
          />
        }
        label="お気に入りのみ"
      />

      <div className="flex flex-col gap-3 mt-8 max-w-md">
        {games
          .filter((game) =>
            (filter === 'すべて' || game.status === filter) &&
            (!favoriteOnly || game.favorite)
          )
          .map((game, index) => (
            <Card key={index}>
              <CardContent>
                <Typography variant="h6">
                  {game.title}
                </Typography>

                <Typography color="text.secondary">
                  {game.platform}
                </Typography>

                <Chip
                  label={game.status}
                  size="small"
                />

                <Rating
                  value={game.rating}
                  readOnly
                />

                <Accordion>
                  <AccordionSummary expandIcon={<span>▼</span>}>
                    <Typography>詳細情報</Typography>
                  </AccordionSummary>

                  <AccordionDetails>

                    <Typography>
                      プレイ時間：{game.playTime}時間
                    </Typography>

                    {game.favorite && (
                      <Typography>
                        ★ お気に入り
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    setEditId(game.id);
                    setTitle(game.title);
                    setPlatform(game.platform);
                    setStatus(game.status);
                    setRating(game.rating);
                    setPlayTime(game.playTime);
                    setFavorite(game.favorite);
                  }}
                >
                  編集
                </Button>
                <Button
                  color="error"
                  onClick={() => setDeleteId(game.id)}
                >
                  削除
                </Button>
              </CardActions>
            </Card>
          ))}
      </div>

      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>ゲームを削除</DialogTitle>

        <DialogContent>
          <DialogContentText>
            本当に削除しますか？
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>
            キャンセル
          </Button>

          <Button
            color="error"
            onClick={() => {
              if (deleteId !== null) {
                setGames(games.filter((game) => game.id !== deleteId));
                setDeleteId(null);
                setMessage('ゲームを削除しました');
                if (editId === deleteId) {
                  resetForm();
                }
              }
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={message !== ''}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
      >
        <Alert
          severity="success"
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;