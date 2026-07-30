import type { ModuleContent, ModuleMeta } from './types'
import { yarismaHaritasi } from './yarisma-haritasi'
import { klasikKopru } from './klasik-kopru'
import { kuantumTemeller } from './kuantum-temeller'
import { isingQubo } from './ising-qubo'
import { qaoa } from './qaoa'
import { vqeHibrit } from './vqe-hibrit'
import { ibmPlatform } from './ibm-platform'
import { qiskitAtolyesi } from './qiskit-atolyesi'
import { nisqIbm } from './nisq-ibm'
import { sektorBankaFinans } from './sektor-banka-finans'
import { sektorHaberlesme } from './sektor-haberlesme'
import { cozumDisiplini } from './cozum-disiplini'

export const modules: ModuleContent[] = [
  yarismaHaritasi,
  klasikKopru,
  kuantumTemeller,
  isingQubo,
  qaoa,
  vqeHibrit,
  ibmPlatform,
  qiskitAtolyesi,
  nisqIbm,
  sektorBankaFinans,
  sektorHaberlesme,
  cozumDisiplini,
]

export const moduleMetas: ModuleMeta[] = [
  {
    slug: 'yarisma-haritasi',
    order: 1,
    title: 'Yarışma Haritası',
    subtitle: 'Aşamalar, takım yapısı ve hazırlık checklist',
    season: 1,
    seasonTitle: 'Temeller',
    levelLabel: 'Keşif',
  },
  {
    slug: 'klasik-kopru',
    order: 2,
    title: 'Klasik Köprü',
    subtitle: 'Maliyet fonksiyonu, kısıt ve kombinatoriyel zorluk',
    season: 1,
    seasonTitle: 'Temeller',
    levelLabel: 'Keşif',
  },
  {
    slug: 'kuantum-temeller',
    order: 3,
    title: 'Kuantum Temeller',
    subtitle: 'Qubit, süperpozisyon, ölçüm ve dolaşıklık',
    season: 1,
    seasonTitle: 'Temeller',
    levelLabel: 'Keşif',
  },
  {
    slug: 'ising-qubo',
    order: 4,
    title: 'Ising & QUBO',
    subtitle: 'Binary encoding ve Max-Cut → QUBO dönüşümü',
    season: 2,
    seasonTitle: 'Formülasyon',
    levelLabel: 'Atölye',
  },
  {
    slug: 'qaoa',
    order: 5,
    title: 'QAOA',
    subtitle: 'Mixer, cost Hamiltonian ve parametre landscape',
    season: 2,
    seasonTitle: 'Formülasyon',
    levelLabel: 'Atölye',
  },
  {
    slug: 'vqe-hibrit',
    order: 6,
    title: 'VQE Hibrit',
    subtitle: 'Ansatz, varyasyonel döngü ve optimizer rolü',
    season: 2,
    seasonTitle: 'Formülasyon',
    levelLabel: 'Atölye',
  },
  {
    slug: 'ibm-platform',
    order: 7,
    title: 'IBM Quantum Platform',
    subtitle: 'Hesap, Open Plan, Learning ve Qiskit ekosistemi',
    season: 3,
    seasonTitle: 'Araçlar & IBM',
    levelLabel: 'Atölye',
  },
  {
    slug: 'qiskit-atolyesi',
    order: 8,
    title: 'Qiskit Atölyesi',
    subtitle: 'Kurulum, venv, hello devre ve bulut notebook',
    season: 3,
    seasonTitle: 'Araçlar & IBM',
    levelLabel: 'Atölye',
  },
  {
    slug: 'nisq-ibm',
    order: 9,
    title: 'NISQ & IBM',
    subtitle: 'Gürültü, shot, transpile ve simulator vs QPU',
    season: 3,
    seasonTitle: 'Araçlar & IBM',
    levelLabel: 'Atölye',
  },
  {
    slug: 'sektor-banka-finans',
    order: 10,
    title: 'Sektör: Banka & Finans',
    subtitle: 'Portföy ve risk toy QUBO problemleri',
    season: 4,
    seasonTitle: 'Yarışma',
    levelLabel: 'Atölye',
  },
  {
    slug: 'sektor-haberlesme',
    order: 11,
    title: 'Sektör: Haberleşme',
    subtitle: 'Routing ve kanal atama kısıtları',
    season: 4,
    seasonTitle: 'Yarışma',
    levelLabel: 'Atölye',
  },
  {
    slug: 'cozum-disiplini',
    order: 12,
    title: 'Çözüm Disiplini',
    subtitle: 'Problem okuma → QUBO → algoritma → sunum',
    season: 4,
    seasonTitle: 'Yarışma',
    levelLabel: 'Atölye',
  },
]

export function getModuleBySlug(slug: string): ModuleContent | undefined {
  return modules.find((m) => m.slug === slug)
}

export function getModuleMeta(slug: string): ModuleMeta | undefined {
  return moduleMetas.find((m) => m.slug === slug)
}

export function getAllModuleMetas(): ModuleMeta[] {
  return [...moduleMetas].sort((a, b) => a.order - b.order)
}

export function getAdjacentModules(slug: string): {
  prev?: ModuleMeta
  next?: ModuleMeta
} {
  const metas = getAllModuleMetas()
  const index = metas.findIndex((m) => m.slug === slug)
  if (index === -1) return {}
  return {
    prev: index > 0 ? metas[index - 1] : undefined,
    next: index < metas.length - 1 ? metas[index + 1] : undefined,
  }
}

export function groupModulesBySeason(metas: ModuleMeta[]): Map<number, ModuleMeta[]> {
  const groups = new Map<number, ModuleMeta[]>()
  for (const meta of metas) {
    const list = groups.get(meta.season) ?? []
    list.push(meta)
    groups.set(meta.season, list)
  }
  return groups
}
