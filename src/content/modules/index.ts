import type { ModuleContent, ModuleMeta } from './types'
import { yarismaHaritasi } from './yarisma-haritasi'
import { klasikKopru } from './klasik-kopru'
import { kuantumTemeller } from './kuantum-temeller'
import { isingQubo } from './ising-qubo'
import { qaoa } from './qaoa'
import { vqeHibrit } from './vqe-hibrit'
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
  },
  {
    slug: 'klasik-kopru',
    order: 2,
    title: 'Klasik Köprü',
    subtitle: 'Maliyet fonksiyonu, kısıt ve kombinatoriyel zorluk',
  },
  {
    slug: 'kuantum-temeller',
    order: 3,
    title: 'Kuantum Temeller',
    subtitle: 'Qubit, süperpozisyon, ölçüm ve dolaşıklık',
  },
  {
    slug: 'ising-qubo',
    order: 4,
    title: 'Ising & QUBO',
    subtitle: 'Binary encoding ve Max-Cut → QUBO dönüşümü',
  },
  {
    slug: 'qaoa',
    order: 5,
    title: 'QAOA',
    subtitle: 'Mixer, cost Hamiltonian ve parametre landscape',
  },
  {
    slug: 'vqe-hibrit',
    order: 6,
    title: 'VQE Hibrit',
    subtitle: 'Ansatz, varyasyonel döngü ve optimizer rolü',
  },
  {
    slug: 'nisq-ibm',
    order: 7,
    title: 'NISQ & IBM',
    subtitle: 'Gürültü, shot, transpile ve simulator vs QPU',
  },
  {
    slug: 'sektor-banka-finans',
    order: 8,
    title: 'Sektör: Banka & Finans',
    subtitle: 'Portföy ve risk toy QUBO problemleri',
  },
  {
    slug: 'sektor-haberlesme',
    order: 9,
    title: 'Sektör: Haberleşme',
    subtitle: 'Routing ve kanal atama kısıtları',
  },
  {
    slug: 'cozum-disiplini',
    order: 10,
    title: 'Çözüm Disiplini',
    subtitle: 'Problem okuma → QUBO → algoritma → sunum',
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
