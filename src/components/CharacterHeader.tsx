
import { Character } from '../types/Character';

interface CharacterHeaderProps {
  character: Character;
}

const CharacterHeader = ({ character }: CharacterHeaderProps) => {
  return (
    <div className="glass-card m-2 p-3 shadow-lg sticky top-2 z-10 border border-white/20">
      <div className="text-center">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {character.name}
        </h1>
        <p className="text-white/70 text-xs">
          ${character.money.toLocaleString()}
        </p>
        {character.currentEducation && (
          <p className="text-blue-400 text-xs italic mt-1">
            📚 {character.currentEducation} ({character.educationYearsLeft} yrs)
          </p>
        )}
      </div>
    </div>
  );
};

export default CharacterHeader;
