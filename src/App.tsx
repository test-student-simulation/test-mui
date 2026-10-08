import {
  TextField,
  FormControlLabel,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  IconButton,
  Pagination,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import { type Game, initialGame } from './types';
import GameDialog from './components/GameDialog';

function App() {
  const [game, setGame] = useState<Game>(initialGame);

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
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const resetForm = () => {
    setGame(initialGame);
    setEditId(null);
    setError('');
  };
  const handleSave = () => {
    if (game.title.trim() === '') {
      setError('ゲームタイトルを入力してください');
      return;
    }

    if (editId !== null) {
      setGames(games.map((g) =>
        g.id === editId ? { ...game, id: editId } : g
      ));
      setMessage('ゲームを更新しました');
    } else {
      setGames([...games, {
        ...game,
        id: crypto.randomUUID(),
      }]);
      setMessage('ゲームを登録しました');
    }

    resetForm();
    setDialogOpen(false);
  };

  const filteredGames = games.filter((game) =>
    (filter === 'すべて' || game.status === filter) &&
    (!favoriteOnly || game.favorite) &&
    game.title.toLowerCase().includes(search.toLowerCase())
  );
  const pageSize = 5;
  const pageCount = Math.ceil(filteredGames.length / pageSize);
  const pagedGames = filteredGames.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  useEffect(() => {
    if (page > Math.max(1, pageCount)) {
      setPage(Math.max(1, pageCount));
    }
  }, [page, pageCount]);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            ゲーム管理
          </h1>
          <Button
            variant="contained"
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            新規登録
          </Button>
        </div>


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

        <TextField
          label="ゲームを検索"
          size="small"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="mt-4"
          slotProps={{
            input: {
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => { setSearch(''); setPage(1); }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Tabs
          value={filter}
          onChange={(_, newValue) => { setFilter(newValue); setPage(1); }}
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
              onChange={(e) => { setFavoriteOnly(e.target.checked); setPage(1); }}
            />
          }
          label="お気に入りのみ"
        />
        {pageCount > 1 && (
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        )}
        <div className="flex flex-col gap-3 mt-8 max-w-md">
          {pagedGames.map((game) => (
            <Card key={game.id}>
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
                    setGame(game);
                    setError('');
                    setDialogOpen(true);
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

        <GameDialog
          open={dialogOpen}
          game={game}
          setGame={setGame}
          editId={editId}
          error={error}
          onSave={handleSave}
          onClose={() => {
            resetForm();
            setDialogOpen(false);
          }}
        />
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
    </div>
  );
}

export default App;