
import { useState } from 'react';
import GameInterface from '../components/GameInterface';
import CharacterCreation from '../components/CharacterCreation';
import { Character } from '../types/Character';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);

  const handleCharacterCreated = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {!gameStarted ? (
        <CharacterCreation onCharacterCreated={handleCharacterCreated} />
      ) : (
        character && <GameInterface character={character} setCharacter={setCharacter} />
      )}
    </div>
  );
};

export default Index;
