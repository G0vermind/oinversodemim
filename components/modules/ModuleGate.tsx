import React from "react";
import { isModuleEnabled, ModuleId } from "../../lib/modules";

interface ModuleGateProps {
  moduleId: ModuleId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente Guardião de Módulos (Feature Gate).
 * Renderiza o conteúdo apenas se o módulo comercial estiver ativo no ambiente.
 */
export function ModuleGate({
  moduleId,
  children,
  fallback = null,
}: ModuleGateProps) {
  const enabled = isModuleEnabled(moduleId);

  if (!enabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
