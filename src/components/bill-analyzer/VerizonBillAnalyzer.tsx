
import { useState } from 'react';
import { BillAnalyzerContent } from './BillAnalyzerContent';
import { ManualEntryForm } from './ManualEntryForm';
import { useVerizonBillAnalyzer } from '@/hooks/use-verizon-bill-analyzer';
import { Button } from '@/components/ui/button';
import { Upload, PencilLine, RefreshCw, Clock, Signal, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export type NetworkPreference = 'verizon' | 'tmobile' | 'att' | null;

const VerizonBillAnalyzer = () => {
  const { 
    billData,
    resetBillData,
    calculateCarrierSavings,
    addManualLineCharges
  } = useVerizonBillAnalyzer();

  const [inputMethod, setInputMethod] = useState<'upload' | 'manual' | null>(null);
  const [networkPreference, setNetworkPreference] = useState<NetworkPreference>(null);
  const [showNetworkError, setShowNetworkError] = useState(false);

  const handleStartOver = () => {
    resetBillData();
    setInputMethod(null);
    setNetworkPreference(null);
    setShowNetworkError(false);
    toast.success("Analysis reset. You can start over.");
  };

  const handleNetworkPreferenceChange = (value: string) => {
    setNetworkPreference(value as NetworkPreference);
    setShowNetworkError(false);
  };

  const handleSubmitForm = (data: any) => {
    if (!networkPreference) {
      setShowNetworkError(true);
      toast.error("Please select which carrier works best in your area");
      return;
    }
    
    addManualLineCharges({...data, networkPreference});
  };

  if (billData) {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto bg-white rounded-lg shadow">
        <div className="flex justify-between items-center px-6 pt-6">
          <h1 className="text-2xl font-bold">Bill Analysis</h1>
          <Button 
            onClick={handleStartOver}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Start Over
          </Button>
        </div>
        <BillAnalyzerContent 
          billData={billData}
          calculateCarrierSavings={calculateCarrierSavings}
          networkPreference={networkPreference}
        />
        
        {billData?.billVersion && (
          <div className="text-xs text-gray-500 p-2 text-right">
            Bill Format Version: {billData.billVersion}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto bg-white rounded-lg shadow">
      {!inputMethod ? (
        <div className="flex flex-col items-center justify-center p-10 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800">Choose Input Method</h2>
          <p className="text-gray-600 text-center max-w-md">
            You can either upload your Verizon bill PDF or manually enter your line charges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button 
              onClick={() => toast.info("Verizon bill upload coming soon!")}
              className="flex-1 h-32 flex-col space-y-3 p-6 relative"
              variant="outline"
              disabled
            >
              <Upload className="h-10 w-10 text-gray-400" />
              <span className="font-medium text-gray-400">Upload Verizon Bill</span>
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/70 rounded-md">
                <div className="bg-gray-800/80 text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  Coming Soon
                </div>
              </div>
            </Button>
            
            <Button 
              onClick={() => setInputMethod('manual')}
              className="flex-1 h-32 flex-col space-y-3 p-6"
              variant="outline"
            >
              <PencilLine className="h-10 w-10 text-green-500" />
              <span className="font-medium">Enter Manually</span>
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 mt-6">
            Both methods will provide you with a detailed analysis and potential savings
          </p>
        </div>
      ) : inputMethod === 'upload' ? (
        <div>
          <Button 
            onClick={() => setInputMethod(null)} 
            variant="ghost" 
            className="m-4"
          >
            ← Back to selection
          </Button>
          <div className="flex flex-col items-center justify-center p-10 space-y-8">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full">
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">Verizon Bill Upload Coming Soon</h3>
            <p className="text-gray-500 text-center max-w-md">
              We're working on enabling direct bill uploads. For now, please use the manual entry option.
            </p>
            <Button 
              onClick={() => setInputMethod('manual')} 
              variant="default"
            >
              Switch to Manual Entry
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button 
            onClick={() => setInputMethod(null)} 
            variant="ghost" 
            className="m-4"
          >
            ← Back to selection
          </Button>
          
          <div className="px-6 pt-2 pb-6">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Signal className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium">Which carrier works best in your area?</h3>
                    <span className="text-red-500">*</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    This helps us recommend the best US Mobile plan for your location. US Mobile offers plans on multiple networks.
                  </p>
                  
                  {showNetworkError && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
                      <AlertTriangle size={16} />
                      <span>Please select a network preference to continue</span>
                    </div>
                  )}
                  
                  <RadioGroup 
                    value={networkPreference || ''} 
                    onValueChange={handleNetworkPreferenceChange}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                      <RadioGroupItem value="verizon" id="verizon" />
                      <Label htmlFor="verizon" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Verizon</span>
                        <span className="text-xs text-gray-500">We'll recommend Warp</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                      <RadioGroupItem value="tmobile" id="tmobile" />
                      <Label htmlFor="tmobile" className="flex flex-col cursor-pointer">
                        <span className="font-medium">T-Mobile</span>
                        <span className="text-xs text-gray-500">We'll recommend Lightspeed</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                      <RadioGroupItem value="att" id="att" />
                      <Label htmlFor="att" className="flex flex-col cursor-pointer">
                        <span className="font-medium">AT&T</span>
                        <span className="text-xs text-gray-500">We'll recommend Darkstar</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <ManualEntryForm onSubmit={handleSubmitForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VerizonBillAnalyzer;
