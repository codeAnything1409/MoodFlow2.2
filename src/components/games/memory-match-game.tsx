'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Brain, Car, Anchor, Apple, Atom, Award, Axe, BaggageClaim, Banana, Beer, Bike, Bomb, Bone, BookOpen } from 'lucide-react';
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

const ICONS = [
  { icon: Brain },
  { icon: Car },
  { icon: Anchor },
  { icon: Apple },
  { icon: Atom },
  { icon: Award },
  { icon: Axe },
  { icon: BaggageClaim },
  { icon: Banana },
  { icon: Beer },
  { icon: Bike },
  { icon: Bomb },
  { icon: Bone },
  { icon: BookOpen },
];

type CardData = {
  id: number;
  icon: React.ElementType;
  isFlipped: boolean;
  isMatched: boolean;
};

const createBoard = (): CardData[] => {
  const iconPairs = [...ICONS, ...ICONS];
  const shuffled = iconPairs.sort(() => Math.random() - 0.5);
  return shuffled.map((item, index) => ({
    id: index,
    icon: item.icon,
    isFlipped: false,
    isMatched: false,
  }));
};

export default function MemoryMatchGame() {
  const [board, setBoard] = useState<CardData[]>(createBoard());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = () => {
    setBoard(createBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsGameOver(false);
    setIsChecking(false);
  };

  const handleCardClick = (id: number) => {
    if (isChecking || board[id].isFlipped || board[id].isMatched || flippedCards.length === 2) {
      return;
    }

    const newBoard = board.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setBoard(newBoard);
    
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);
    }
  };

  useEffect(() => {
    if (flippedCards.length !== 2) return;

    setIsChecking(true);
    const [firstId, secondId] = flippedCards;
    const firstCard = board.find(c => c.id === firstId);
    const secondCard = board.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
      // Match
      const newBoard = board.map(card =>
        card.icon === firstCard.icon ? { ...card, isMatched: true, isFlipped: true } : card
      );
      setBoard(newBoard);
      setFlippedCards([]);
      setIsChecking(false);
      
      if (newBoard.every(card => card.isMatched)) {
        setIsGameOver(true);
      }

    } else {
      // No match
      setTimeout(() => {
        const newBoard = board.map(card =>
          card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card
        );
        setBoard(newBoard);
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  }, [flippedCards, board]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-headline">Memory Match</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 sm:gap-3">
            {board.map(card => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isChecking || card.isFlipped}
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-md border text-4xl font-bold transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    card.isFlipped ? 'bg-muted' : 'bg-background hover:bg-accent/50',
                  )}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <div className={cn("transition-opacity duration-300", card.isFlipped ? 'opacity-100' : 'opacity-0')}>
                     <Icon className="h-8 w-8 text-primary" />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex w-full items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
            <div className="font-bold text-lg">Moves: {moves}</div>
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>
       <AlertDialog open={isGameOver} onOpenChange={setIsGameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations! You Won! 🎉</AlertDialogTitle>
            <AlertDialogDescription>
              You matched all the pairs in {moves} moves. Great memory!
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
