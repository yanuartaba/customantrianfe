import CS1 from "../img/cs1.png";
import CS2 from "../img/cs2.png";
import CS3 from "../img/cs3.png";
import CS4 from "../img/cs4.png";

export const dataMenu = [
  {
    id: 1,
    kode: "A",
    label: "Teller",
    urlParam: "teller",
    images: CS1,
    desc: "Counter yang bertugas melayani nasabah terkait keperluan perbankan, seperti: buka tabungan, transfer, penarikan dll",
  },
  {
    id: 2,
    kode: "B",
    label: "Customer Service",
    urlParam: "customer-service",
    images: CS2,
    desc: "Counter yang bertugas melayani nasabah terkait keperluan pelayanan perbankan umum lainnya seperti: deposito, valuta asing, dll",
  },
  {
    id: 3,
    kode: "C",
    label: "Loan Assistant",
    urlParam: "loan-assistant",
    images: CS3,
    desc: "Counter yang bertugas melayani membantu nasabah dalam urusan pinjaman seperti: KPR, Kredit mobil, Kredit usaha dll",
  },
  {
    id: 4,
    kode: "D",
    label: "Insurance Officer",
    urlParam: "insurance-officer",
    images: CS4,
    desc: "Counter yang bertugas melayani nasabah terkait urusan asuransi seperti: klaim asuransi, pembayaran premi, dll",
  },
];

const now = Date.now();
let s = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
export const localString = s.toLocaleDateString("id-ID", options);

export const dataAntrian = [
  {
    id: now,
    nomor: "A1",
    dateTime: localString,
  },
];

export const activeCounter = [
  {
    id: 1,
    noAntrian: "01A",
    noCounter: "Teler: 01",
  },
  {
    id: 2,
    noAntrian: "03A",
    noCounter: "Teler: 02",
  },
  {
    id: 3,
    noAntrian: "11B",
    noCounter: "Customer Service: 01",
  },
  {
    id: 4,
    noAntrian: "05D",
    noCounter: "Loan Officer: 01",
  },
];
