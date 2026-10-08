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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Slider,
    Tooltip,
} from '@mui/material';
import { type Game } from '../types';

type GameDialogProps = {
    open: boolean;
    game: Game;
    setGame: (game: Game) => void;
    editId: string | null;
    error: string;
    onSave: () => void;
    onClose: () => void;
};

export default function GameDialog({
    open,
    game,
    setGame,
    editId,
    error,
    onSave,
    onClose,
}: GameDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {editId !== null ? 'ゲームを編集' : 'ゲームを登録'}
            </DialogTitle>

            <DialogContent className="flex flex-col gap-4 pt-4!">
                <TextField
                    label="ゲームタイトル"
                    value={game.title}
                    onChange={(e) => setGame({ ...game, title: e.target.value })}
                />
                <FormControl>
                    <InputLabel>プラットフォーム</InputLabel>

                    <Select
                        value={game.platform}
                        label="プラットフォーム"
                        onChange={(e) => setGame({ ...game, platform: e.target.value })}
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
                        value={game.status}
                        onChange={(e) => setGame({ ...game, status: e.target.value })}
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
                        value={game.rating}
                        onChange={(_, newValue) => setGame({ ...game, rating: newValue })}
                    />
                </div>
                <div>
                    <FormLabel>プレイ時間：{game.playTime}時間</FormLabel>
                    <Tooltip title="これまでにプレイした合計時間を設定します">
                        <Slider
                            value={game.playTime}
                            onChange={(_, value) => setGame({ ...game, playTime: value as number })}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </Tooltip>
                </div>
                <FormControlLabel
                    control={
                        <Switch
                            checked={game.favorite}
                            onChange={(e) => setGame({ ...game, favorite: e.target.checked })}
                        />
                    }
                    label="お気に入り"
                />
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

            </DialogContent>

            <DialogActions>
                <Button variant="contained" onClick={onSave}>
                    {editId !== null ? '更新' : '登録'}
                </Button>

                <Button onClick={onClose}>
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
}