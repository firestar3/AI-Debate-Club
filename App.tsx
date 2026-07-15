
import React, { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry, Debater, DebateConfig, Tournament, TournamentMatch, TournamentRound, TournamentType } from './types';
import { DEBATERS } from './constants';
import DebateSetup from './components/DebateSetup';
import DebateArena from './components/DebateArena';
import Leaderboard from './components/Leaderboard';
import TournamentManager from './components/TournamentManager';
import { Gavel, Trophy, Swords, LayoutGrid, Scroll, BookOpen, Settings, X } from 'lucide-react';

type AppState = 'setup' | 'debating' | 'leaderboard' | 'tournament';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('setup');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [debateConfig, setDebateConfig] = useState<DebateConfig | null>(null);
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);
  const [activeMatch, setActiveMatch] = useState<TournamentMatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('gemini_api_key') || '';
    } catch (e) {
      console.warn("localStorage is not available:", e);
      return '';
    }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsSaved(true);
  };

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  useEffect(() => {
    try {
      if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    } catch (e) {
      console.warn("localStorage is not available:", e);
    }
  }, [apiKey]);

  useEffect(() => {
    const fetchLeaderboard = () => {
      setIsLoading(true);
      let savedLeaderboard = null;
      try {
        savedLeaderboard = localStorage.getItem('debate_leaderboard_v3');
      } catch (e) {
        console.warn("localStorage is not available:", e);
      }
      
      if (savedLeaderboard) {
        try {
          const parsed = JSON.parse(savedLeaderboard);
          // Merge with DEBATERS to ensure any new debaters are added cleanly
          const merged = DEBATERS.map(d => {
            const existing = parsed.find((p: LeaderboardEntry) => p.name === d.name);
            if (existing) {
              return {
                ...d,
                wins: existing.wins ?? 0,
                losses: existing.losses ?? 0,
                ties: existing.ties ?? 0,
                totalDebates: existing.totalDebates ?? 0,
                affDebates: existing.affDebates ?? 0,
                negDebates: existing.negDebates ?? 0,
                totalPoints: existing.totalPoints ?? 0,
                totalRounds: existing.totalRounds ?? 0,
              };
            }
            return { 
              ...d, 
              wins: 0, 
              losses: 0, 
              ties: 0,
              totalDebates: 0, 
              affDebates: 0, 
              negDebates: 0,
              totalPoints: 0,
              totalRounds: 0,
            };
          });

          setLeaderboard(merged);
          try {
            localStorage.setItem('debate_leaderboard_v3', JSON.stringify(merged));
          } catch (e) {
            console.warn("localStorage is not available:", e);
          }
        } catch (e) {
          console.error("Error parsing leaderboard:", e);
          initializeDefault();
        }
      } else {
        initializeDefault();
      }
      setIsLoading(false);
    };

    const initializeDefault = () => {
      const initial = DEBATERS.map(d => ({ 
        ...d, 
        wins: 0, 
        losses: 0, 
        ties: 0,
        totalDebates: 0, 
        affDebates: 0, 
        negDebates: 0,
        totalPoints: 0,
        totalRounds: 0,
      }));

      setLeaderboard(initial);
      try {
        localStorage.setItem('debate_leaderboard_v3', JSON.stringify(initial));
      } catch (e) {
        console.warn("localStorage is not available:", e);
      }
    };

    fetchLeaderboard();
  }, []);


  const handleStartDebate = (topic: string, debater1: Debater, debater2: Debater) => {
    setDebateConfig({ topic, debaters: [debater1, debater2] });
    setAppState('debating');
  };

  const handleStartTournament = (participants: Debater[], type: TournamentType = 'single') => {
    const numParticipants = participants.length;
    const rounds: TournamentRound[] = [];

    if (type === 'single') {
      const numRounds = Math.log2(numParticipants);
      // Initialize first round
      const firstRoundMatches: TournamentMatch[] = [];
      for (let i = 0; i < numParticipants; i += 2) {
        firstRoundMatches.push({
          id: `r0-m${i / 2}`,
          debater1: participants[i],
          debater2: participants[i + 1],
          winner: null,
          topic: null,
          isCompleted: false,
          roundIndex: 0,
          matchIndex: i / 2,
          bracket: 'winners',
        });
      }
      rounds.push({ name: 'Quarter-Finals', bracket: 'winners', matches: firstRoundMatches });

      // Initialize subsequent rounds
      for (let r = 1; r < numRounds; r++) {
        const numMatches = numParticipants / Math.pow(2, r + 1);
        const roundMatches: TournamentMatch[] = [];
        for (let m = 0; m < numMatches; m++) {
          roundMatches.push({
            id: `r${r}-m${m}`,
            debater1: null,
            debater2: null,
            winner: null,
            topic: null,
            isCompleted: false,
            roundIndex: r,
            matchIndex: m,
            bracket: 'winners',
          });
        }
        const roundName = r === numRounds - 1 ? 'Finals' : r === numRounds - 2 ? 'Semi-Finals' : `Round ${r + 1}`;
        rounds.push({ name: roundName, bracket: 'winners', matches: roundMatches });
      }

      // Adjust round names if fewer participants
      if (numParticipants === 4) {
        rounds[0].name = 'Semi-Finals';
        rounds[1].name = 'Finals';
      } else if (numParticipants === 2) {
        rounds[0].name = 'Finals';
      }
    } else {
      // Double Elimination Logic (simplified for 4 or 8)
      // Winners Bracket
      const numWinnersRounds = Math.log2(numParticipants);
      for (let r = 0; r < numWinnersRounds; r++) {
        const numMatches = numParticipants / Math.pow(2, r + 1);
        const roundMatches: TournamentMatch[] = [];
        for (let m = 0; m < numMatches; m++) {
          roundMatches.push({
            id: `w-r${r}-m${m}`,
            debater1: r === 0 ? participants[m * 2] : null,
            debater2: r === 0 ? participants[m * 2 + 1] : null,
            winner: null,
            topic: null,
            isCompleted: false,
            roundIndex: r,
            matchIndex: m,
            bracket: 'winners',
          });
        }
        const roundName = r === numWinnersRounds - 1 ? 'Winners Finals' : `Winners Round ${r + 1}`;
        rounds.push({ name: roundName, bracket: 'winners', matches: roundMatches });
      }

      // Losers Bracket
      // For 8 players: 
      // L-R0 (2 matches): Losers of W-R0 play each other
      // L-R1 (2 matches): Winners of L-R0 vs Losers of W-R1
      // L-R2 (1 match): Winners of L-R1 play each other
      // L-R3 (1 match): Winner of L-R2 vs Loser of W-R2
      
      const numLosersRounds = (numWinnersRounds - 1) * 2;
      for (let r = 0; r < numLosersRounds; r++) {
        const isMajorRound = r % 2 === 1; // Major rounds bring in losers from winners bracket
        const numMatches = numParticipants / Math.pow(2, Math.floor(r / 2) + 2);
        
        const roundMatches: TournamentMatch[] = [];
        for (let m = 0; m < numMatches; m++) {
          roundMatches.push({
            id: `l-r${r}-m${m}`,
            debater1: null,
            debater2: null,
            winner: null,
            topic: null,
            isCompleted: false,
            roundIndex: r,
            matchIndex: m,
            bracket: 'losers',
          });
        }
        const roundName = r === numLosersRounds - 1 ? 'Losers Finals' : `Losers Round ${r + 1}`;
        rounds.push({ name: roundName, bracket: 'losers', matches: roundMatches });
      }

      // Grand Finals
      rounds.push({
        name: 'Grand Finals',
        bracket: 'finals',
        matches: [{
          id: 'grand-final',
          debater1: null,
          debater2: null,
          winner: null,
          topic: null,
          isCompleted: false,
          roundIndex: 0,
          matchIndex: 0,
          bracket: 'finals',
        }]
      });
    }

    setActiveTournament({
      id: Date.now().toString(),
      type,
      rounds,
      winner: null,
      isCompleted: false,
    });
  };

  const handleStartTournamentMatch = (match: TournamentMatch, topic: string) => {
    if (!match.debater1 || !match.debater2) return;
    setActiveMatch(match);
    setDebateConfig({ topic, debaters: [match.debater1, match.debater2] });
    setAppState('debating');
  };

  const handleResetTournament = () => {
    setActiveTournament(null);
    setActiveMatch(null);
  };
  
  const handleDebateEnd = useCallback((
    winnerName: string | null,
    loserName: string | null,
    matchResult: {
      isTie: boolean;
      points: { [name: string]: number };
      roundsPlayed: number;
      isRateLimit?: boolean;
    }
  ) => {
    if (matchResult?.isRateLimit) {
      setActiveMatch(null);
      if (activeTournament) {
        setAppState('tournament');
      } else {
        setAppState('setup');
      }
      return;
    }

    if (debateConfig) {
      const debater1 = debateConfig.debaters[0];
      const debater2 = debateConfig.debaters[1];

      // Update Leaderboard with tie, average points, and 2-round schema
      const updatedLeaderboard = leaderboard.map(entry => {
        const isParticipant = entry.name === debater1.name || entry.name === debater2.name;
        if (!isParticipant) return entry;

        const pointsScored = matchResult.points[entry.name] || 0;
        const isWinner = entry.name === winnerName;
        const isLoser = entry.name === loserName;

        return {
          ...entry,
          totalDebates: entry.totalDebates + 1,
          affDebates: entry.affDebates + 1,
          negDebates: entry.negDebates + 1,
          wins: isWinner ? entry.wins + 1 : entry.wins,
          losses: isLoser ? entry.losses + 1 : entry.losses,
          ties: matchResult.isTie ? (entry.ties || 0) + 1 : (entry.ties || 0),
          totalPoints: (entry.totalPoints || 0) + pointsScored,
          totalRounds: (entry.totalRounds || 0) + 2,
        };
      });

      setLeaderboard(updatedLeaderboard);
      try {
        localStorage.setItem('debate_leaderboard_v3', JSON.stringify(updatedLeaderboard));
      } catch (e) {
        console.warn("localStorage is not available:", e);
      }

      // Handle Tournament progression
      if (activeTournament && activeMatch) {
        let tournamentWinner: Debater | null = null;
        let tournamentLoser: Debater | null = null;

        if (winnerName && loserName) {
          tournamentWinner = debateConfig.debaters.find(d => d.name === winnerName) || null;
          tournamentLoser = debateConfig.debaters.find(d => d.name === loserName) || null;
        } else {
          // It was a tie! Resolve based on higher total points in this match
          const d1Pts = matchResult.points[debater1.name] || 0;
          const d2Pts = matchResult.points[debater2.name] || 0;
          
          if (d1Pts > d2Pts) {
            tournamentWinner = debater1;
            tournamentLoser = debater2;
          } else if (d2Pts > d1Pts) {
            tournamentWinner = debater2;
            tournamentLoser = debater1;
          } else {
            // Equal points: use alphabetical tiebreak
            if (debater1.name < debater2.name) {
              tournamentWinner = debater1;
              tournamentLoser = debater2;
            } else {
              tournamentWinner = debater2;
              tournamentLoser = debater1;
            }
          }
        }

        if (tournamentWinner && tournamentLoser) {
          const winner = tournamentWinner;
          const loser = tournamentLoser;
          const updatedRounds = activeTournament.rounds.map((round) => {
            // Update the current match
            if (round.bracket === activeMatch.bracket) {
              return {
                ...round,
                matches: round.matches.map(match => {
                  if (match.id === activeMatch.id) {
                    return { ...match, winner, isCompleted: true, topic: debateConfig.topic };
                  }
                  return match;
                })
              };
            }
            return round;
          });

          // Single Elimination Progression
          if (activeTournament.type === 'single') {
            const nextRoundIdx = activeTournament.rounds.findIndex(r => r.bracket === 'winners' && r.matches.some(m => m.roundIndex === activeMatch.roundIndex + 1));
            if (nextRoundIdx !== -1) {
              const nextMatchIndex = Math.floor(activeMatch.matchIndex / 2);
              const isFirstPosition = activeMatch.matchIndex % 2 === 0;
              updatedRounds[nextRoundIdx].matches[nextMatchIndex].debater1 = isFirstPosition ? winner : updatedRounds[nextRoundIdx].matches[nextMatchIndex].debater1;
              updatedRounds[nextRoundIdx].matches[nextMatchIndex].debater2 = !isFirstPosition ? winner : updatedRounds[nextRoundIdx].matches[nextMatchIndex].debater2;
            }
          } else {
            // Double Elimination Progression
            if (activeMatch.bracket === 'winners') {
              // Winner moves forward in Winners
              const nextWinnersRoundIdx = activeTournament.rounds.findIndex(r => r.bracket === 'winners' && r.matches[0].roundIndex === activeMatch.roundIndex + 1);
              
              if (nextWinnersRoundIdx !== -1) {
                const nextMatchIndex = Math.floor(activeMatch.matchIndex / 2);
                const isFirstPosition = activeMatch.matchIndex % 2 === 0;
                const nextMatch = updatedRounds[nextWinnersRoundIdx].matches[nextMatchIndex];
                if (isFirstPosition) nextMatch.debater1 = winner;
                else nextMatch.debater2 = winner;
              } else {
                // Winner of Winners Finals moves to Grand Finals
                const grandFinalsIdx = updatedRounds.findIndex(r => r.bracket === 'finals');
                updatedRounds[grandFinalsIdx].matches[0].debater1 = winner;
              }

              // Loser moves to Losers Bracket
              if (activeMatch.roundIndex === 0) {
                // Losers of first winners round go to first losers round
                const losersRoundIdx = updatedRounds.findIndex(r => r.bracket === 'losers' && r.matches[0].roundIndex === 0);
                const losersMatchIndex = Math.floor(activeMatch.matchIndex / 2);
                const isFirstPosition = activeMatch.matchIndex % 2 === 0;
                const nextMatch = updatedRounds[losersRoundIdx].matches[losersMatchIndex];
                if (isFirstPosition) nextMatch.debater1 = loser;
                else nextMatch.debater2 = loser;
              } else {
                // Losers of subsequent winners rounds go to "major" losers rounds
                const losersRoundIdx = updatedRounds.findIndex(r => r.bracket === 'losers' && r.roundIndex === activeMatch.roundIndex * 2 - 1);
                if (losersRoundIdx !== -1) {
                  const nextMatch = updatedRounds[losersRoundIdx].matches[activeMatch.matchIndex];
                  nextMatch.debater2 = loser; // Losers from winners bracket usually take the second slot
                }
              }
            } else if (activeMatch.bracket === 'losers') {
              // Winner moves forward in Losers
              const currentLosersRoundIdx = activeTournament.rounds.indexOf(activeTournament.rounds.find(r => r.bracket === 'losers' && r.matches[0].roundIndex === activeMatch.roundIndex)!);
              const nextLosersRoundIdx = currentLosersRoundIdx + 1;
              const nextRound = updatedRounds[nextLosersRoundIdx];
              
              if (nextRound && nextRound.bracket === 'losers') {
                const isMajorRound = nextRound.matches.length === updatedRounds[currentLosersRoundIdx].matches.length;
                if (isMajorRound) {
                  // In major rounds, winners of previous round meet losers from winners bracket
                  nextRound.matches[activeMatch.matchIndex].debater1 = winner;
                } else {
                  // In minor rounds, winners of previous round meet each other
                  const nextMatchIndex = Math.floor(activeMatch.matchIndex / 2);
                  const isFirstPosition = activeMatch.matchIndex % 2 === 0;
                  if (isFirstPosition) nextRound.matches[nextMatchIndex].debater1 = winner;
                  else nextRound.matches[nextMatchIndex].debater2 = winner;
                }
              } else {
                // Winner of Losers Finals moves to Grand Finals
                const grandFinalsIdx = updatedRounds.findIndex(r => r.bracket === 'finals');
                updatedRounds[grandFinalsIdx].matches[0].debater2 = winner;
              }
            }
          }

          const isFinalMatch = activeMatch.bracket === 'finals';
          setActiveTournament({
            ...activeTournament,
            rounds: updatedRounds,
            winner: isFinalMatch ? winner : activeTournament.winner,
            isCompleted: isFinalMatch,
          });
          setActiveMatch(null);
          setAppState('tournament');
          return;
        }
      }
    }
    setAppState('leaderboard');
  }, [leaderboard, debateConfig, activeTournament, activeMatch]);

  const resetToSetup = () => {
    setDebateConfig(null);
    setAppState('setup');
  }

  const renderContent = () => {
    if (isLoading && appState !== 'debating') {
      return (
        <div className="flex justify-center items-center h-full pt-20">
          <div className="text-center animate-in fade-in duration-700">
            <p className="text-lg text-green-500/50 font-medium italic">Loading...</p>
          </div>
        </div>
      );
    }

    switch (appState) {
      case 'debating':
        return debateConfig && <DebateArena config={debateConfig} onDebateEnd={handleDebateEnd} />;
      case 'leaderboard':
        return <Leaderboard leaderboard={leaderboard} onNewDebate={resetToSetup} />;
      case 'tournament':
        return (
          <TournamentManager
            activeTournament={activeTournament}
            onStartTournament={handleStartTournament}
            onStartMatch={handleStartTournamentMatch}
            onResetTournament={handleResetTournament}
          />
        );
      case 'setup':
      default:
        return <DebateSetup onStartDebate={handleStartDebate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-stone-200 flex flex-col font-sans">
      <header className="p-6 border-b border-white/5 bg-[#0a0b0c]">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Debate Club
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Simple Logic & Rhetoric</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={resetToSetup}
                className={`px-6 py-2 rounded transition-all duration-300 text-xs font-bold uppercase tracking-widest ${
                  appState === 'setup' || appState === 'debating'
                    ? 'bg-green-600 text-black'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-white/5'
                }`}
              >
                Debate
              </button>
              <button
                onClick={() => setAppState('leaderboard')}
                className={`px-6 py-2 rounded transition-all duration-300 text-xs font-bold uppercase tracking-widest ${
                  appState === 'leaderboard'
                    ? 'bg-green-600 text-black'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-white/5'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setAppState('tournament')}
                className={`px-6 py-2 rounded transition-all duration-300 text-xs font-bold uppercase tracking-widest ${
                  appState === 'tournament'
                    ? 'bg-green-600 text-black'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-white/5'
                }`}
              >
                Tournament
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${isSettingsOpen ? 'bg-green-600 text-black' : 'text-stone-400 hover:text-stone-100 hover:bg-white/5'}`}
              >
                {isSettingsOpen ? <X size={20} /> : <Settings size={20} />}
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-[#0f1113] border border-white/10 rounded-lg shadow-2xl p-6 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">API Configuration</h3>
                      <div className="flex items-center gap-2 bg-stone-900 border border-white/5 rounded px-3 py-2">
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => handleApiKeyChange(e.target.value)}
                          placeholder="Paste Gemini API Key..."
                          className="bg-transparent text-xs text-stone-300 outline-none w-full"
                        />
                        {isSaved && (
                          <span className="text-[9px] text-green-500 font-black uppercase shrink-0 animate-pulse">Saved</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-white/5">
                      <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between text-[10px] text-green-500 hover:text-green-400 transition-colors uppercase tracking-widest font-bold"
                      >
                        Get Key here
                      </a>
                    </div>


                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {renderContent()}
      </main>
      <footer className="text-center p-8 text-[10px] text-stone-500 border-t border-white/5 uppercase tracking-[0.2em]">
        version = 3.6.4 - 2026
      </footer>
    </div>
  );
};

export default App;
