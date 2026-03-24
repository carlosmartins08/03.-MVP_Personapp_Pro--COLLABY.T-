
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/usePWA";
import { Download } from "lucide-react";

export const InstallPrompt = () => {
  const { isInstallable, promptInstall } = usePWA();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium">
          Instale a PersonaClinic no seu celular para acesso rápido
        </p>
      </div>
      <Button 
        variant="default" 
        size="sm" 
        onClick={promptInstall}
        className="ml-4"
      >
        <Download className="h-4 w-4 mr-2" />
        Instalar
      </Button>
    </div>
  );
};
