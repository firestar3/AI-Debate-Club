
export interface Debater {
  name: string;
  avatarColor: string;
  title: string;
  personality: string;
}

export interface LeaderboardEntry extends Debater {
  wins: number;
  losses: number;
  ties: number;
  totalDebates: number;
  negDebates: number;
  affDebates: number;
  totalPoints: number;
  totalRounds: number;
}

export interface DebateConfig {
  topic: string;
  debaters: [Debater, Debater];
}

export enum DebatePhase {
  AFF_CONSTRUCTIVE,
  NEG_CONSTRUCTIVE,
  AFF_REBUTTAL,
  NEG_REBUTTAL,
  AFF_FINAL_FOCUS,
  NEG_FINAL_FOCUS,
  JUDGING,
  FINISHED,
}

export interface DebateTurn {
  debater: Debater;
  stance: 'For' | 'Against';
  phase: DebatePhase;
  statement: string;
}

export type TournamentType = 'single' | 'double';
export type BracketType = 'winners' | 'losers' | 'finals';

export interface TournamentMatch {
  id: string;
  debater1: Debater | null;
  debater2: Debater | null;
  winner: Debater | null;
  topic: string | null;
  isCompleted: boolean;
  roundIndex: number;
  matchIndex: number;
  bracket: BracketType;
}

export interface TournamentRound {
  name: string;
  bracket: BracketType;
  matches: TournamentMatch[];
}

export interface Tournament {
  id: string;
  type: TournamentType;
  rounds: TournamentRound[];
  winner: Debater | null;
  isCompleted: boolean;
}
