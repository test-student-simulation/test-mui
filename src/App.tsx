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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TableContainer,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState(0);
  const [sortKey, setSortKey] = useState<keyof Game>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
  const handleSort = (key: keyof Game) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredGames = games.filter((game) =>
    (filter === 'すべて' || game.status === filter) &&
    (!favoriteOnly || game.favorite) &&
    game.title.toLowerCase().includes(search.toLowerCase())
  );
  const pageSize = 5;
  const pageCount = Math.ceil(filteredGames.length / pageSize);
  const sortedGames = [...filteredGames].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    const result = String(aValue).localeCompare(
      String(bValue),
      'ja',
      { numeric: true }
    );
    return sortOrder === 'asc' ? result : -result;
  });

  const pagedGames = sortedGames.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  useEffect(() => {
    if (page > Math.max(1, pageCount)) {
      setPage(Math.max(1, pageCount));
    }
  }, [page, pageCount]);

  return (
    <div className="min-h-screen px-6 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            ゲーム管理
          </h1>

          <div className="flex items-center gap-2">
            <Button
              variant="contained"
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              新規登録
            </Button>
            <Button
              variant="contained"
              onClick={() => setDrawerOpen(true)}>
              検索・絞り込み
            </Button>
          </div>
        </div>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div className="flex w-80 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <Typography variant="h6">検索・絞り込み</Typography>
              <IconButton
                aria-label="閉じる"
                onClick={() => setDrawerOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </div>

            <div className="flex flex-col gap-4 p-0">
              <TextField
                label="ゲームを検索"
                placeholder="タイトルで検索"
                size="small"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="mt-4"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
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

              <div className="flex flex-col gap-1">
                <Typography variant="subtitle2" color="text.secondary">
                  プレイ状況で絞り込み
                </Typography>
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  size="small"
                  onChange={(_, value) => {
                    if (value !== null) {
                      setFilter(value);
                      setPage(1);
                    }
                  }}
                >
                  <ToggleButton value="すべて">すべて</ToggleButton>
                  <ToggleButton value="未プレイ">未プレイ</ToggleButton>
                  <ToggleButton value="プレイ中">プレイ中</ToggleButton>
                  <ToggleButton value="クリア">クリア</ToggleButton>
                </ToggleButtonGroup>
              </div>

              <FormControlLabel
                control={
                  <Switch
                    checked={favoriteOnly}
                    onChange={(e) => { setFavoriteOnly(e.target.checked); setPage(1); }}
                  />
                }
                label="お気に入りのみ"
              />
            </div>
          </div>
        </Drawer>

        <div className="flex items-center gap-2">
          <Typography variant="h6">
            ゲーム一覧
          </Typography>

          <Chip
            label={filteredGames.length}
            size="small"
            variant="outlined"
          />
          {/* <Badge
            badgeContent={games.length}
            color="primary"
          >
            <span>登録数</span>
          </Badge> */}

          <Tabs
            value={viewMode}
            onChange={(_, value) => setViewMode(value)}
          >
            <Tab label="カード" />
            <Tab label="テーブル" />
          </Tabs>

          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          )}
        </div>

        {viewMode === 0 && (
          <div className="flex flex-col gap-2">
            {filteredGames
              .slice((page - 1) * pageSize, page * pageSize)
              .map((game) => (
                <Card key={game.id}>
                  <CardContent className="!py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {game.title}
                        </Typography>

                        <div className="flex items-center gap-3 flex-wrap">
                          <Typography variant="body2" color="text.secondary">
                            {game.platform}
                          </Typography>

                          <Chip label={game.status} size="small" />

                          <Rating value={game.rating} size="small" readOnly />

                          {game.favorite && <span>★</span>}
                        </div>
                      </div>

                      <div className="flex shrink-0">
                        <IconButton
                          aria-label="編集"
                          onClick={() => {
                            setEditId(game.id);
                            setGame(game);
                            setError('');
                            setDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          aria-label="削除"
                          onClick={() => setDeleteId(game.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
        {viewMode === 1 && (
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ backgroundColor: 'grey.300' }}>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortKey === 'title'}
                      direction={sortKey === 'title' ? sortOrder : 'asc'}
                      onClick={() => handleSort('title')}
                    >
                      タイトル
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortKey === 'platform'}
                      direction={sortKey === 'platform' ? sortOrder : 'asc'}
                      onClick={() => handleSort('platform')}
                    >
                      機種
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortKey === 'status'}
                      direction={sortKey === 'status' ? sortOrder : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      プレイ状況
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortKey === 'rating'}
                      direction={sortKey === 'rating' ? sortOrder : 'asc'}
                      onClick={() => handleSort('rating')}
                    >
                      評価
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pagedGames.map((game) => (
                  <TableRow key={game.id} hover>
                    <TableCell>{game.title}</TableCell>
                    <TableCell>{game.platform}</TableCell>
                    <TableCell>{game.status}</TableCell>
                    <TableCell>
                      <Rating value={game.rating} size="small" readOnly />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="編集"
                        onClick={() => {
                          setEditId(game.id);
                          setGame(game);
                          setError('');
                          setDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        aria-label="削除"
                        onClick={() => setDeleteId(game.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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
              「{games.find((game) => game.id === deleteId)?.title}」
              を本当に削除しますか？
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