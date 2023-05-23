export interface Part {
  machine: string;
  reportNumber: string;
  name: string;
  articleNo: string;
  tool: string;
  comment?: string;
  totalPartsProduced: number;
  scrapNo: number;
  id: string;
}

export const MOCK_PRODUCTION_REPORT: Part[] = [
  {
    machine: 'SG-101',
    reportNumber: '1234',
    name: 'Test',
    articleNo: '12023-123',
    tool: '219',
    totalPartsProduced: 120,
    scrapNo: 90,
    id: '1;2'
  },

  {
    machine: 'SG-102',
    reportNumber: '1334',
    name: 'Test2',
    articleNo: '1213123-1233',
    tool: 'tools123',
    totalPartsProduced: 150,
    scrapNo: 0,
    id: '3;4'
  },

  {
    machine: 'SG-110',
    reportNumber: '14234',
    name: 'Test23',
    articleNo: '12353-123',
    tool: '213434',
    totalPartsProduced: 100,
    scrapNo: 50,
    id: '5;1'
  },

  {
    machine: 'SG-11023',
    name: 'Test23A',
    reportNumber: '12344',
    articleNo: '1232023-123',
    tool: 'exampleTool11',
    totalPartsProduced: 50,
    scrapNo: 50,
    id: '1;5'
  },
];
