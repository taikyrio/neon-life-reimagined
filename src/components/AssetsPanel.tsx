
import { Character, Asset as CharacterAsset } from '../types/Character'; // Renamed to avoid conflict if Asset type is also defined here
import { ASSET_OPTIONS } from '../types/Asset'; // Ensure this is the correct Asset type from your definitions
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssetsPanelProps {
  character: Character;
  onAction: (actionType: string, payload: { [key: string]: any }) => void;
}

const AssetsPanel = ({ character, onAction }: AssetsPanelProps) => {
  const totalAssetValue = character.assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/70 border-slate-700 shadow-lg">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-white text-lg">My Assets</CardTitle>
          <p className="text-slate-300 text-sm">Total Value: <span className="font-semibold text-green-400">${totalAssetValue.toLocaleString()}</span></p>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto px-3 pb-3 pr-1">
          {character.assets.length === 0 ? (
            <p className="text-slate-400 text-center py-4">You don't own any assets yet. Check "Actions" to acquire some!</p>
          ) : (
            character.assets.map(asset => {
              // Find the original asset details from ASSET_OPTIONS for full description, if needed
              const assetDetails = ASSET_OPTIONS.find(opt => opt.id === asset.id);
              return (
                <Card key={asset.id} className="bg-slate-700/50 border-slate-600 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-white font-semibold">{asset.name} <span className="text-xs text-slate-400">({asset.type})</span></h4>
                    <p className="text-green-400 font-medium">${asset.currentValue.toLocaleString()}</p>
                  </div>
                  <p className="text-slate-300 text-xs mb-1">{assetDetails?.description || asset.description}</p>
                  <div className="grid grid-cols-2 gap-x-2 text-xs mb-2">
                    <p className="text-slate-400">Bought: <span className="text-white">${asset.purchasePrice.toLocaleString()}</span> (Yr {asset.purchaseYear})</p>
                    <p className="text-red-400">Maint./mo: <span className="text-white">${asset.monthlyMaintenance.toLocaleString()}</span></p>
                    <p className="text-sky-400">Income/mo: <span className="text-white">${asset.monthlyIncome.toLocaleString()}</span></p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="w-full text-xs py-1"
                    onClick={() => onAction('sell_asset', { assetId: asset.id, sellPrice: asset.currentValue })}
                  >
                    Sell for ${asset.currentValue.toLocaleString()}
                  </Button>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetsPanel;
