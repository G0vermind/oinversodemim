import { Metadata } from "next";
import { AUTHOR_NAME, SITE_NAME } from "../../lib/site";
import { isModuleEnabled } from "../../lib/modules";
import { BiografiaEditorial } from "../../modules/biografia";
import { ModuleNotice } from "../../components/modules/ModuleNotice";

export const metadata: Metadata = {
  title: `Memorial Biográfico | ${AUTHOR_NAME}`,
  description: `Trajetória literária, manifesto lírico e parceria sonora de ${AUTHOR_NAME} com a Gerasom em ${SITE_NAME}`,
};

export default function BiografiaPage() {
  const isEnabled = isModuleEnabled("biografiaEditorial");

  if (!isEnabled) {
    return <ModuleNotice moduleId="biografiaEditorial" backHref="/" />;
  }

  return <BiografiaEditorial />;
}
