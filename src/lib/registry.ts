import dynamic from "next/dynamic";
import React from "react";
import catalog from "@/lib/side-by-side-data.json";
import manifest from "../../rea-skipper-manifest.json";

interface CatalogEntry { id: string; title: string; collection: string; dependencies?: string[] }
interface SourceEntry { id: string; specUrl?: string }
type ComponentLoader = () => Promise<{ default: React.ComponentType<any> }>;

export interface ComponentRegistryEntry {
  id: string;
  title: string;
  category: string;
  upstreamUrl: string | null;
  dependencies: string[];
  load: ComponentLoader;
  component: React.ComponentType<any>;
}

const componentLoaders: Record<string, ComponentLoader> = {
  skipper1: () => import("@/components/v1/skipper1"),
  skipper2: () => import("@/components/v1/skipper2"),
  skipper3: () => import("@/components/v1/skipper3"),
  skipper4: () => import("@/components/v1/skipper4"),
  skipper5: () => import("@/components/v1/skipper5"),
  skipper6: () => import("@/components/v1/skipper6"),
  skipper7: () => import("@/components/v1/skipper7"),
  skipper8: () => import("@/components/v1/skipper8"),
  skipper9: () => import("@/components/v1/skipper9"),
  skipper10: () => import("@/components/v1/skipper10"),
  skipper11: () => import("@/components/v1/skipper11"),
  skipper12: () => import("@/components/v1/skipper12"),
  skipper13: () => import("@/components/v1/skipper13"),
  skipper14: () => import("@/components/v1/skipper14"),
  skipper15: () => import("@/components/v1/skipper15"),
  skipper16: () => import("@/components/v1/skipper16"),
  skipper17: () => import("@/components/v1/skipper17"),
  skipper18: () => import("@/components/v1/skipper18"),
  skipper19: () => import("@/components/v1/skipper19"),
  skipper20: () => import("@/components/v1/skipper20"),
  skipper21: () => import("@/components/v1/skipper21"),
  skipper22: () => import("@/components/v1/skipper22"),
  skipper23: () => import("@/components/v1/skipper23"),
  skipper24: () => import("@/components/v1/skipper24"),
  skipper25: () => import("@/components/v1/skipper25"),
  skipper26: () => import("@/components/v1/skipper26"),
  skipper27: () => import("@/components/v1/skipper27"),
  skipper28: () => import("@/components/v1/skipper28"),
  skipper29: () => import("@/components/v1/skipper29"),
  skipper30: () => import("@/components/v1/skipper30"),
  skipper31: () => import("@/components/v1/skipper31"),
  skipper32: () => import("@/components/v1/skipper32"),
  skipper33: () => import("@/components/v1/skipper33"),
  skipper34: () => import("@/components/v1/skipper34"),
  skipper35: () => import("@/components/v1/skipper35"),
  skipper36: () => import("@/components/v1/skipper36"),
  skipper37: () => import("@/components/v1/skipper37"),
  skipper38: () => import("@/components/v1/skipper38"),
  skipper39: () => import("@/components/v1/skipper39"),
  skipper40: () => import("@/components/v1/skipper40"),
  skipper41: () => import("@/components/v1/skipper41"),
  skipper42: () => import("@/components/v1/skipper42"),
  skipper43: () => import("@/components/v1/skipper43"),
  skipper44: () => import("@/components/v1/skipper44"),
  skipper45: () => import("@/components/v1/skipper45"),
  skipper46: () => import("@/components/v1/skipper46"),
  skipper47: () => import("@/components/v1/skipper47"),
  skipper48: () => import("@/components/v1/skipper48"),
  skipper49: () => import("@/components/v1/skipper49"),
  skipper50: () => import("@/components/v1/skipper50"),
  skipper51: () => import("@/components/v1/skipper51"),
  skipper52: () => import("@/components/v1/skipper52"),
  skipper53: () => import("@/components/v1/skipper53"),
  skipper54: () => import("@/components/v1/skipper54"),
  skipper55: () => import("@/components/v1/skipper55"),
  skipper56: () => import("@/components/v1/skipper56"),
  skipper57: () => import("@/components/v1/skipper57"),
  skipper58: () => import("@/components/v1/skipper58"),
  skipper59: () => import("@/components/v1/skipper59"),
  skipper60: () => import("@/components/v1/skipper60"),
  skipper61: () => import("@/components/v1/skipper61"),
  skipper62: () => import("@/components/v1/skipper62"),
  skipper63: () => import("@/components/v1/skipper63"),
  skipper64: () => import("@/components/v1/skipper64"),
  skipper65: () => import("@/components/v1/skipper65"),
  skipper66: () => import("@/components/v1/skipper66"),
  skipper67: () => import("@/components/v1/skipper67"),
  skipper68: () => import("@/components/v1/skipper68"),
  skipper69: () => import("@/components/v1/skipper69"),
  skipper70: () => import("@/components/v1/skipper70"),
  skipper71: () => import("@/components/v1/skipper71"),
  skipper72: () => import("@/components/v1/skipper72"),
  skipper73: () => import("@/components/v1/skipper73"),
  skipper74: () => import("@/components/v1/skipper74"),
  skipper75: () => import("@/components/v1/skipper75"),
  skipper76: () => import("@/components/v1/skipper76"),
  skipper77: () => import("@/components/v1/skipper77"),
  skipper78: () => import("@/components/v1/skipper78"),
  skipper79: () => import("@/components/v1/skipper79"),
  skipper80: () => import("@/components/v1/skipper80"),
  skipper81: () => import("@/components/v1/skipper81"),
  skipper82: () => import("@/components/v1/skipper82"),
  skipper83: () => import("@/components/v1/skipper83"),
  skipper84: () => import("@/components/v1/skipper84"),
  skipper85: () => import("@/components/v1/skipper85"),
  skipper86: () => import("@/components/v1/skipper86"),
  skipper87: () => import("@/components/v1/skipper87"),
  skipper88: () => import("@/components/v1/skipper88"),
  skipper89: () => import("@/components/v1/skipper89"),
  skipper90: () => import("@/components/v1/skipper90"),
  skipper91: () => import("@/components/v1/skipper91"),
  skipper92: () => import("@/components/v1/skipper92"),
  skipper93: () => import("@/components/v1/skipper93"),
  skipper94: () => import("@/components/v1/skipper94"),
  skipper95: () => import("@/components/v1/skipper95"),
  skipper96: () => import("@/components/v1/skipper96"),
  skipper97: () => import("@/components/v1/skipper97"),
  skipper98: () => import("@/components/v1/skipper98"),
  skipper99: () => import("@/components/v1/skipper99"),
  skipper100: () => import("@/components/v1/skipper100"),
  skipper101: () => import("@/components/v1/skipper101"),
  skipper102: () => import("@/components/v1/skipper102"),
  skipper103: () => import("@/components/v1/skipper103"),
  skipper104: () => import("@/components/v1/skipper104"),
  skipper105: () => import("@/components/v1/skipper105"),
  skipper106: () => import("@/components/v1/skipper106"),
  skipper107: () => import("@/components/v1/skipper107"),
};
const upstreamById = new Map((manifest as SourceEntry[]).map((entry) => [entry.id, entry.specUrl ?? null]));

export const componentRegistry: Record<string, ComponentRegistryEntry> = Object.fromEntries(
  (catalog as CatalogEntry[]).map((entry) => {
    const load = componentLoaders[entry.id];
    if (!load) throw new Error("No dynamic loader registered for " + entry.id);
    return [entry.id, {
      id: entry.id,
      title: entry.title,
      category: entry.collection,
      upstreamUrl: upstreamById.get(entry.id) ?? null,
      dependencies: entry.dependencies ?? [],
      load,
      component: dynamic(load, { ssr: false }),
    }];
  }),
);
