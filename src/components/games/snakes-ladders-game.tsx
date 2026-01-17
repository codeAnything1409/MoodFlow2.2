'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, User, Bot, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const BOARD_SIZE = 100;

// key: start square, value: end square
const SNAKES_AND_LADDERS: Record<number, number> = {
  // Ladders
  4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91,
  // Snakes
  17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78,
};

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const getPositionCoords = (pos: number): { x: number, y: number } => {
  const adjustedPos = pos - 1;
  const row = 9 - Math.floor(adjustedPos / 10);
  let col = adjustedPos % 10;
  if (row % 2 !== 1) { 
    col = 9 - col;
  }
  return { x: col, y: row };
}

const SnakeOrLadderSVG = ({ from, to }: { from: number, to: number }) => {
  const start = getPositionCoords(from);
  const end = getPositionCoords(to);
  
  const x1 = start.x * 40 + 20;
  const y1 = start.y * 40 + 20;
  const x2 = end.x * 40 + 20;
  const y2 = end.y * 40 + 20;
  
  const isLadder = to > from;

  if (isLadder) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const ladderWidth = 10;
    const rungCount = Math.floor(length / 10);
    
    // Ladder side rails
    const rail1_x1 = x1 + (ladderWidth/2) * Math.cos(angle + Math.PI/2);
    const rail1_y1 = y1 + (ladderWidth/2) * Math.sin(angle + Math.PI/2);
    const rail1_x2 = x2 + (ladderWidth/2) * Math.cos(angle + Math.PI/2);
    const rail1_y2 = y2 + (ladderWidth/2) * Math.sin(angle + Math.PI/2);

    const rail2_x1 = x1 - (ladderWidth/2) * Math.cos(angle + Math.PI/2);
    const rail2_y1 = y1 - (ladderWidth/2) * Math.sin(angle + Math.PI/2);
    const rail2_x2 = x2 - (ladderWidth/2) * Math.cos(angle + Math.PI/2);
    const rail2_y2 = y2 - (ladderWidth/2) * Math.sin(angle + Math.PI/2);

    return (
      <g stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap='round'>
        <line x1={rail1_x1} y1={rail1_y1} x2={rail1_x2} y2={rail1_y2} />
        <line x1={rail2_x1} y1={rail2_y1} x2={rail2_x2} y2={rail2_y2} />
        {Array.from({length: rungCount}).map((_, i) => {
          const progress = (i + 1) / (rungCount + 1);
          const rung_x1 = rail1_x1 + progress * (rail1_x2 - rail1_x1);
          const rung_y1 = rail1_y1 + progress * (rail1_y2 - rail1_y1);
          const rung_x2 = rail2_x1 + progress * (rail2_x2 - rail2_x1);
          const rung_y2 = rail2_y1 + progress * (rail2_y2 - rail2_y1);
          return <line key={i} x1={rung_x1} y1={rung_y1} x2={rung_x2} y2={rung_y2} />;
        })}
      </g>
    );
  }

  // Snake
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const angle = Math.atan2(dy, dx);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const spread = dist / 6;

  // Curvy path for the snake
  const c1x = midX - spread * Math.sin(angle);
  const c1y = midY + spread * Math.cos(angle);
  const c2x = midX + spread * Math.sin(angle) * 0.8;
  const c2y = midY - spread * Math.cos(angle) * 0.8;

  // Head of the snake
  const headAngle = Math.atan2(y2 - c2y, x2 - c2x);
  const headSize = 8;
  const eyeSize = 1.5;

  return (
    <g>
      <path 
        d={`M${x1},${y1} Q${c1x},${c1y} ${midX},${midY} T${x2},${y2}`}
        stroke="hsl(var(--destructive))"
        strokeWidth="6"
        strokeLinecap='round'
        fill="none"
      />
      <path 
        d={`M${x1},${y1} Q${c1x},${c1y} ${midX},${midY} T${x2},${y2}`}
        stroke="hsl(var(--destructive-foreground))"
        strokeWidth="2"
        strokeDasharray="4 6"
        strokeLinecap='round'
        fill="none"
      />
      {/* Snake Head */}
      <g transform={`translate(${x2}, ${y2}) rotate(${headAngle * 180 / Math.PI})`}>
        <circle cx="0" cy="0" r={headSize / 2} fill="hsl(var(--destructive))" />
        <circle cx={headSize / 4} cy={-headSize/4} r={eyeSize} fill="white" />
        <circle cx={headSize / 4} cy={headSize/4} r={eyeSize} fill="white" />
        <path d={`M${headSize/2},0 l${headSize/3},${headSize/4} l-${headSize/3},${headSize/4}`} fill="none" strokeWidth="1" stroke="white" />
      </g>
    </g>
  );
};


export default function SnakesAndLaddersGame() {
  const [userPosition, setUserPosition] = useState(1);
  const [computerPosition, setComputerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [currentPlayer, setCurrentPlayer] = useState<'user' | 'computer'>('user');
  const [winner, setWinner] = useState<'user' | 'computer' | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [gameLog, setGameLog] = useState<string[]>(['Game started! Your turn.']);

  const boardNumbers = useMemo(() => {
    const numbers = Array.from({ length: BOARD_SIZE }, (_, i) => BOARD_SIZE - i);
    const rows = [];
    for (let i = 0; i < 10; i++) {
      let row = numbers.slice(i * 10, (i + 1) * 10);
      if (i % 2 === 0) {
        row.reverse();
      }
      rows.push(row);
    }
    return rows.flat();
  }, []);

  const addLog = useCallback((message: string) => {
    setGameLog(prev => [message, ...prev.slice(0, 9)]);
  }, []);

  const resetGame = useCallback(() => {
    setUserPosition(1);
    setComputerPosition(1);
    setDiceValue(1);
    setCurrentPlayer('user');
    setWinner(null);
    setIsAlertOpen(false);
    setGameLog(['Game reset! Your turn.']);
  }, []);

  const handleMove = useCallback((player: 'user' | 'computer', currentPos: number, roll: number) => {
    const isUser = player === 'user';
    const playerName = isUser ? 'You' : 'Computer';

    if (currentPos + roll > BOARD_SIZE) {
      addLog(`${playerName} rolled a ${roll} but need to land exactly on ${BOARD_SIZE} to win.`);
      return { newPosition: currentPos, nextPlayer: isUser ? 'computer' : 'user' };
    }
    
    let newPos = currentPos + roll;
    addLog(`${playerName} rolled a ${roll} and moved from ${currentPos} to ${newPos}.`);

    if (SNAKES_AND_LADDERS[newPos]) {
      const finalPos = SNAKES_AND_LADDERS[newPos];
      const type = finalPos > newPos ? 'ladder' : 'snake';
      addLog(`Woah! A ${type} took ${isUser ? 'you' : 'the computer'} from ${newPos} to ${finalPos}.`);
      newPos = finalPos;
    }

    return { newPosition: newPos, nextPlayer: isUser ? 'computer' : 'user' };
  }, [addLog]);

  const performTurn = useCallback((player: 'user' | 'computer', currentPos: number) => {
    if (winner) return;

    setIsRolling(true);
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(rollInterval);
        setIsRolling(false);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        
        const { newPosition, nextPlayer } = handleMove(player, currentPos, finalRoll);
        
        if (player === 'user') {
          setUserPosition(newPosition);
        } else {
          setComputerPosition(newPosition);
        }

        if (newPosition === BOARD_SIZE) {
          setWinner(player);
          setIsAlertOpen(true);
        } else {
          setCurrentPlayer(nextPlayer);
        }
      }
    }, 50);
  }, [handleMove, winner]);
  
  const handleDiceRoll = () => {
    if (currentPlayer === 'user' && !winner && !isRolling) {
      performTurn('user', userPosition);
    }
  };
  
  useEffect(() => {
    if (currentPlayer === 'computer' && !winner && !isRolling) {
      const timer = setTimeout(() => {
        performTurn('computer', computerPosition);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner, computerPosition, performTurn, isRolling]);

  const DiceIcon = DICE_ICONS[diceValue - 1];

  const getSquareContent = (num: number) => {
    const isUser = userPosition === num;
    const isComputer = computerPosition === num;
    if (isUser && isComputer) return <><User size={12} className="text-blue-500" /><Bot size={12} className="text-red-500" /></>;
    if (isUser) return <User size={16} className="text-blue-500" />;
    if (isComputer) return <Bot size={16} className="text-red-500" />;
    return num;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-headline">Snakes & Ladders</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="grid grid-cols-10 border border-muted">
              {boardNumbers.map((num) => (
                <div
                  key={num}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center border border-muted/50 text-xs font-semibold',
                    SNAKES_AND_LADDERS[num] && (SNAKES_AND_LADDERS[num] > num ? 'bg-primary/10' : 'bg-destructive/10')
                  )}
                >
                  <div className="flex gap-0.5">{getSquareContent(num)}</div>
                </div>
              ))}
            </div>
            <svg className="absolute top-0 left-0 h-full w-full pointer-events-none" width="400" height="400" viewBox="0 0 400 400">
              {Object.entries(SNAKES_AND_LADDERS).map(([start, end]) => (
                <SnakeOrLadderSVG key={`${start}-${end}`} from={Number(start)} to={end} />
              ))}
            </svg>
          </div>

          <div className="flex w-full items-center justify-around gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex flex-col items-center">
              <Button 
                onClick={handleDiceRoll} 
                disabled={currentPlayer !== 'user' || !!winner || isRolling} 
                className={cn(
                  "h-16 w-16 rounded-lg shadow-lg transition-all duration-300 ease-in-out",
                  "hover:shadow-primary/50 hover:scale-105 active:scale-95",
                  "bg-gradient-to-br from-background to-muted",
                  isRolling && "animate-pulse",
                  currentPlayer === 'user' && !winner && "animate-bounce"
                )}
                aria-label="Roll the dice"
              >
                <DiceIcon size={40} />
              </Button>
               <span className="mt-2 text-sm font-medium">Roll Dice</span>
            </div>
            <div className="flex flex-col items-center text-center">
               <div className="font-bold text-lg">{winner ? 'Game Over!' : currentPlayer === 'user' ? 'Your Turn' : 'Computer\'s Turn'}</div>
                <div className='flex items-center gap-2'>
                  <User size={16} className="text-blue-500" /> Your Position: {userPosition}
                </div>
                <div className='flex items-center gap-2'>
                  <Bot size={16} className="text-red-500" /> Computer Position: {computerPosition}
                </div>
            </div>
             <Button onClick={resetGame} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
             </Button>
          </div>
           <ScrollArea className="h-28 w-full rounded-md border p-2 text-sm">
            <div className='flex flex-col-reverse'>
              {gameLog.map((log, i) => <p key={i} className={cn("py-1 border-b border-border/20", i > 0 && "text-muted-foreground")}>{log}</p>)}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {winner === 'user' ? 'Congratulations! You Won! 🎉' : 'Game Over! Computer Wins! 😢'}
              <Crown className="text-yellow-500" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              {winner === 'user' ? 'You have conquered the board!' : 'Better luck next time.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
