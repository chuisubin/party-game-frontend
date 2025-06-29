// 全域型別定義，供前端各處 import 使用

export interface Player {
  id: string; // 對應後端 playerId
  name: string;
  role: "owner" | "guest";
  joinedAt: string; // Date 會以 ISO string 傳遞
  isReady: boolean;
  score: number;
  // avatar?: string;
}

export interface Answer {
  playerId: string;
  answer: string;
  isCorrect: boolean;
}

export interface GameData {
  currentQuestioner: string;
  currentWord: string;
  currentImageUrl: string;
  answers: Answer[];
  round: number;
  timeLeft: number;
}

export interface RoomDetail {
  _id: string;
  roomCode: string;
  ownerId: string;
  isPublic: boolean;
  maxPlayers: number;
  players: Player[];
  createdAt: string;
  status: "waiting" | "playing";
  gameType: "guessImage";
  gameData: GameData;
}
