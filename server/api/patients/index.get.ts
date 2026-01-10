// ダミーデータ: 患者一覧
const dummyPatients = [
  {
    id: '1',
    code: 'PT-001',
    name: '患者A',
    age: 45,
    gender: '男性',
    diagnosis: '腰痛',
    lastVisitDate: '2025-01-15',
  },
  {
    id: '2',
    code: 'PT-002',
    name: '患者B',
    age: 32,
    gender: '女性',
    diagnosis: '肩こり',
    lastVisitDate: '2025-01-14',
  },
  {
    id: '3',
    code: 'PT-003',
    name: '患者C',
    age: 58,
    gender: '男性',
    diagnosis: '膝痛',
    lastVisitDate: '2025-01-13',
  },
  {
    id: '4',
    code: 'PT-004',
    name: '患者D',
    age: 28,
    gender: '女性',
    diagnosis: '首痛',
    lastVisitDate: '2025-01-12',
  },
  {
    id: '5',
    code: 'PT-005',
    name: '患者E',
    age: 65,
    gender: '男性',
    diagnosis: '腰痛',
    lastVisitDate: '2025-01-11',
  },
]

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search : undefined

  let filteredPatients = dummyPatients

  if (search) {
    const searchLower = search.toLowerCase()
    filteredPatients = dummyPatients.filter(
      (patient) =>
        patient.code.toLowerCase().includes(searchLower) ||
        patient.name.toLowerCase().includes(searchLower) ||
        patient.diagnosis.toLowerCase().includes(searchLower),
    )
  }

  return {
    patients: filteredPatients,
  }
})
