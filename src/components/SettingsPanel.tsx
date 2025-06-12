
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SettingsPanel = () => {
  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset your game? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Sound Effects</span>
              <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white">
                On
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Music</span>
              <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white">
                Off
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Notifications</span>
              <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white">
                On
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-600 pt-4">
            <h3 className="text-white font-medium mb-3">Game Data</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Export Save Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Import Save Data
              </Button>
              <Button 
                onClick={handleResetGame}
                variant="destructive" 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Reset Game
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-600 pt-4 text-center">
            <p className="text-slate-400 text-sm">Life Simulator v1.0</p>
            <p className="text-slate-500 text-xs">Made with Lovable</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
