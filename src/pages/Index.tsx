
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
    <div className="min-h-screen bg-slate-900">
      {!gameStarted ? (
        <CharacterCreation onCharacterCreate={handleCharacterCreated} /> 
      ) : (
        character && <GameInterface character={character} setCharacter={setCharacter} />
      )}
    </div>
  );
};

export default Index;

