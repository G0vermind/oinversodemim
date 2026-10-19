import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { getModuleConfig, ModuleId } from "../../lib/modules";

interface ModuleNoticeProps {
  moduleId: ModuleId;
  backHref?: string;
  backLabel?: string;
}

/**
 * Exibido quando uma página de um módulo em desenvolvimento / aguardando liberação
 * é acessada diretamente.
 */
export function ModuleNotice({
  moduleId,
  backHref = "/",
  backLabel = "Voltar ao Início",
}: ModuleNoticeProps) {
  const config = getModuleConfig(moduleId);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-12 h-12 mx-auto rounded-full bg-superficie border border-linha flex items-center justify-center text-destaque">
        <Sparkles className="w-5 h-5" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <span className="font-serif text-xs text-destaque tracking-widest uppercase">
          {config?.versao || "Em Breve"}
        </span>
        <h2 className="font-serif text-3xl font-medium text-texto">
          {config?.nome || "Atualização em Preparação"}
        </h2>
        <p className="font-serif italic text-texto-suave text-base">
          {config?.descricao || "Esta funcionalidade estará disponível na próxima atualização do santuário poético."}
        </p>
      </div>

      <div className="pt-4">
        <Link
          href={backHref}
          className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
      </div>
    </div>
  );
}
