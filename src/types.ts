export type Game = {
    id: string;
    title: string;
    platform: string;
    status: string;
    rating: number | null;
    favorite: boolean;
    playTime: number;
};
export const initialGame: Game = {
    id: '',
    title: '',
    platform: '',
    status: '未プレイ',
    rating: 0,
    favorite: false,
    playTime: 0,
};
