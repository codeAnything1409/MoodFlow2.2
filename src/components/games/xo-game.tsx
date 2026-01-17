'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Circle, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Player = 'X' | 'O';
type Square = Player | null;

const USER_PLAYER: Player = 'X';
const COMPUTER_PLAYER: Player = 'O';

export default function XOGame() {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>(USER_PLAYER);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [isGameOverAlertOpen, setIsGameOverAlertOpen] = useState(false);

  const calculateWinner = useCallback((squares: Square[]): Player | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6],           // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, []);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(USER_PLAYER);
    setWinner(null);
    setIsComputerTurn(false);
    setIsGameOverAlertOpen(false);
  };

  const computerMove = useCallback((currentBoard: Square[]) => {
    const availableSquares = currentBoard
      .map((sq, index) => (sq === null ? index : null))
      .filter((i) => i !== null) as number[];
    
    if (availableSquares.length === 0) return;

    // Simple AI: find a random available square
    const randomIndex = Math.floor(Math.random() * availableSquares.length);
    const move = availableSquares[randomIndex];
    
    const newBoard = [...currentBoard];
    newBoard[move] = COMPUTER_PLAYER;
    
    setBoard(newBoard);
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (!newBoard.includes(null)) {
      // It's a draw, winner is null
    } else {
      setCurrentPlayer(USER_PLAYER);
    }
    setIsComputerTurn(false);
  }, [calculateWinner]);

  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      setIsComputerTurn(false);
      setIsGameOverAlertOpen(true);
    } else if (!board.includes(null)) {
      // It's a draw
      setIsGameOverAlertOpen(true);
    } else if (currentPlayer === COMPUTER_PLAYER && !winner) {
      setIsComputerTurn(true);
      const timer = setTimeout(() => {
        computerMove(board);
      }, 500); // Delay for computer's move
      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, winner, calculateWinner, computerMove]);

  const handleClick = (index: number) => {
    if (winner || board[index] || currentPlayer !== USER_PLAYER) return;
    
    const newBoard = [...board];
    newBoard[index] = USER_PLAYER;
    setBoard(newBoard);
    
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setIsGameOverAlertOpen(true);
    } else if (!newBoard.includes(null)) {
      setIsGameOverAlertOpen(true);
    } else {
      setCurrentPlayer(COMPUTER_PLAYER);
    }
  };
  
  const getStatusMessage = () => {
      if(winner) {
          return winner === USER_PLAYER ? "You Win! 🎉" : "Computer Wins! 😢";
      }
      if (!board.includes(null)) {
          return "It's a Draw! 🤝";
      }
      return isComputerTurn ? "Computer's Turn" : "Your Turn";
  }

  const getPopupTitle = () => {
    if (winner === USER_PLAYER) return "Congratulations! 🎉";
    if (winner === COMPUTER_PLAYER) return "Better Luck Next Time! 😢";
    return "It's a Draw! 🤝";
  }

  const getPopupDescription = () => {
    if (winner === USER_PLAYER) return "You are a Tic-Tac-Toe master!";
    if (winner === COMPUTER_PLAYER) return "The computer has bested you this time.";
    return "A hard-fought battle ends in a stalemate.";
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-headline">Tic-Tac-Toe</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {board.map((square, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={cn(
                  'flex h-20 w-20 items-center justify-center rounded-md border text-4xl font-bold transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  'disabled:cursor-not-allowed',
                  square ? 'bg-muted' : 'bg-background hover:bg-accent/50'
                )}
                disabled={!!winner || !!square || isComputerTurn}
              >
                {square === 'X' && <X className="h-10 w-10 text-red-500" />}
                {square === 'O' && <Circle className="h-10 w-10 text-blue-500" />}
              </button>
            ))}
          </div>
          <div className="text-lg font-medium text-center h-8">
              {!isGameOverAlertOpen && getStatusMessage()}
          </div>
          <Button onClick={resetGame} variant="outline" className="flex items-center gap-2">
            <RotateCcw />
            Reset Game
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={isGameOverAlertOpen} onOpenChange={setIsGameOverAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getPopupTitle()}</AlertDialogTitle>
            <AlertDialogDescription>
             {getPopupDescription()}
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
