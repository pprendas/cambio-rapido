import { useState, useEffect, useCallback, useRef } from "react";

const CURRENCIES = [
  { code: "USD", name: "Dólar Estadounidense", flag: "🇺🇸", country: "Estados Unidos" },
  { code: "CRC", name: "Colón Costarricense", flag: "🇨🇷", country: "Costa Rica" },
  { code: "ARS", name: "Peso Argentino", flag: "🇦🇷", country: "Argentina" },
  { code: "MXN", name: "Peso Mexicano", flag: "🇲🇽", country: "México" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", country: "Europa" },
  { code: "GBP", name: "Libra Esterlina", flag: "🇬🇧", country: "Reino Unido" },
  { code: "JPY", name: "Yen Japonés", flag: "🇯🇵", country: "Japón" },
  { code: "BRL", name: "Real Brasileño", flag: "🇧🇷", country: "Brasil" },
  { code: "COP", name: "Peso Colombiano", flag: "🇨🇴", country: "Colombia" },
  { code: "CLP", name: "Peso Chileno", flag: "🇨🇱", country: "Chile" },
  { code: "PEN", name: "Sol Peruano", flag: "🇵🇪", country: "Perú" },
  { code: "UYU", name: "Peso Uruguayo", flag: "🇺🇾", country: "Uruguay" },
  { code: "BOB", name: "Boliviano", flag: "🇧🇴", country: "Bolivia" },
  { code: "PYG", name: "Guaraní Paraguayo", flag: "🇵🇾", country: "Paraguay" },
  { code: "CAD", name: "Dólar Canadiense", flag: "🇨🇦", country: "Canadá" },
  { code: "AUD", name: "Dólar Australiano", flag: "🇦🇺", country: "Australia" },
  { code: "CHF", name: "Franco Suizo", flag: "🇨🇭", country: "Suiza" },
  { code: "CNY", name: "Yuan Chino", flag: "🇨🇳", country: "China" },
  { code: "KRW", name: "Won Surcoreano", flag: "🇰🇷", country: "Corea del Sur" },
  { code: "INR", name: "Rupia India", flag: "🇮🇳", country: "India" },
  { code: "GTQ", name: "Quetzal Guatemalteco", flag: "🇬🇹", country: "Guatemala" },
  { code: "HNL", name: "Lempira Hondureño", flag: "🇭🇳", country: "Honduras" },
  { code: "NIO", name: "Córdoba Nicaragüense", flag: "🇳🇮", country: "Nicaragua" },
  { code: "PAB", name: "Balboa Panameño", flag: "🇵🇦", country: "Panamá" },
  { code: "DOP", name: "Peso Dominicano", flag: "🇩🇴", country: "Rep. Dominicana" },
  { code: "NOK", name: "Corona Noruega", flag: "🇳🇴", country: "Noruega" },
  { code: "SEK", name: "Corona Sueca", flag: "🇸🇪", country: "Suecia" },
  { code: "THB", name: "Baht Tailandés", flag: "🇹🇭", country: "Tailandia" },
  { code: "SGD", name: "Dólar de Singapur", flag: "🇸🇬", country: "Singapur" },
  { code: "TRY", name: "Lira Turca", flag: "🇹🇷", country: "Turquía" },
  { code: "ZAR", name: "Rand Sudafricano", flag: "🇿🇦", country: "Sudáfrica" },
  { code: "PLN", name: "Esloti Polaco", flag: "🇵🇱", country: "Polonia" },
];

const DEFAULT_FAVS = ["CRC", "USD", "ARS", "EUR", "MXN"];

const fmt = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "—";
  if (n >= 1_000_000) return n.toLocaleString("es-CR", { maximumFractionDigits: 0 });
  if (n >= 1000) return n.toLocaleString("es-CR", { maximumFractionDigits: 2 });
  if (n >= 1) return n.toLocaleString("es-CR", { maximumFractionDigits: 4 });
  return n.toLocaleString("es-CR", { maximumFractionDigits: 6 });
};

const fmtTime = (d) =>
  d.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }) +
  " · " + d.toLocaleDateString("es-CR", { day: "2-digit", month: "short" });

function generateSparkData(baseRate, points = 14) {
  const data = [baseRate];
  for (let i = 1; i < points; i++) {
    const change = (Math.random() - 0.48) * baseRate * 0.012;
    data.push(Math.max(0.0001, data[i - 1] + change));
  }
  return data;
}

function Sparkline({ data, width = 400, height = 52 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return [x, y];
  });
  const linePath = "M " + pts.map(p => p.join(",")).join(" L ");
  const areaPath = `M 0,${height} L ${pts.map(p => p.join(",")).join(" L ")} L ${width},${height} Z`;
  const trend = data[data.length - 1] >= data[0];
  const color = trend ? "#3ddc84" : "#ff5a5a";
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="4" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="7" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#070a0f;--bg2:#0d1117;--surface:#111620;--surface2:#181e2a;
  --border:#1e2535;--border2:#252e40;--text:#e8ecf4;--muted:#3d4a60;
  --muted2:#6b7a99;--accent:#f5c842;--ag:rgba(245,200,66,.18);
  --green:#3ddc84;--gg:rgba(61,220,132,.15);--red:#ff5a5a;--rg:rgba(255,90,90,.15);
  --blue:#5b9cf6;--pink:#e879b0;--teal:#2dd4bf;
  --font:'Outfit',sans-serif;--mono:'JetBrains Mono',monospace;--r:14px;--rs:10px;
}
.lm{
  --bg:#f0f2f8;--bg2:#e4e7f2;--surface:#ffffff;--surface2:#f4f5fb;
  --border:#dde0ee;--border2:#c8ccdf;--text:#141820;--muted:#b0b8cc;--muted2:#6b7699;
}
html,body{background:var(--bg);color:var(--text);font-family:var(--font);-webkit-font-smoothing:antialiased}
.app{min-height:100vh;max-width:480px;margin:0 auto;padding-bottom:24px;position:relative;overflow-x:hidden}
.mesh{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.mesh::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(245,200,66,.07) 0%,transparent 70%);top:-200px;left:-100px;animation:drift 12s ease-in-out infinite alternate}
.mesh::after{content:'';position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(61,220,132,.05) 0%,transparent 70%);bottom:-100px;right:-100px;animation:drift 16s ease-in-out infinite alternate-reverse}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(40px,30px)}}
.rel{position:relative;z-index:1}
.header{padding:22px 20px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);background:linear-gradient(180deg,var(--bg2) 0%,transparent 100%)}
.logo{display:flex;align-items:center;gap:10px}
.logo-icon{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#f5c842,#e07b20);display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 16px rgba(245,200,66,.3)}
.logo-text h1{font-size:18px;font-weight:800;letter-spacing:-.4px}
.logo-text h1 span{background:linear-gradient(90deg,var(--accent),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.logo-text p{font-size:10px;color:var(--muted2);font-family:var(--mono);margin-top:1px}
.hdr-r{display:flex;align-items:center;gap:8px}
.pill{display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:5px 10px;font-size:11px;font-family:var(--mono);color:var(--muted2)}
.dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:pulse 2s infinite}
.dot.loading{background:var(--accent);box-shadow:0 0 8px var(--accent)}
.dot.error{background:var(--red);box-shadow:0 0 8px var(--red)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.ibtn{width:34px;height:34px;border-radius:10px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;transition:all .15s;color:var(--text)}
.ibtn:hover{border-color:var(--accent);background:var(--ag)}
.tabs{display:flex;padding:0 20px;border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:10}
.tab{padding:12px 14px;font-size:13px;font-weight:600;background:transparent;border:none;color:var(--muted2);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;font-family:var(--font);transition:all .15s;white-space:nowrap}
.tab.active{color:var(--accent);border-bottom-color:var(--accent)}
.tab:hover:not(.active){color:var(--text)}
.sec{padding:18px 20px}
.base-card{background:linear-gradient(135deg,var(--surface) 0%,var(--surface2) 100%);border:1px solid var(--border2);border-radius:var(--r);padding:18px;margin-bottom:16px;box-shadow:0 8px 32px rgba(0,0,0,.25);position:relative;overflow:hidden}
.base-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--ag),transparent 60%);pointer-events:none}
.base-top{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.bflag{font-size:32px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4))}
.bmeta{flex:1}
.bmeta .code{font-size:20px;font-weight:800;letter-spacing:-.5px}
.bmeta .ctry{font-size:11px;color:var(--muted2);margin-top:2px}
.chbtn{background:var(--surface2);border:1px solid var(--border2);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;color:var(--muted2);cursor:pointer;font-family:var(--font);transition:all .15s}
.chbtn:hover{border-color:var(--accent);color:var(--accent);background:var(--ag)}
.amt-row{display:flex;align-items:center}
.amt-in{flex:1;background:var(--bg);border:1.5px solid var(--border2);border-radius:var(--rs);padding:12px 16px;font-size:26px;font-weight:700;font-family:var(--mono);color:var(--text);outline:none;width:100%;transition:border-color .2s}
.amt-in:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--ag)}
.amt-in::placeholder{color:var(--muted)}
.rlbl{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.rlabel{font-size:10px;font-family:var(--mono);color:var(--muted);text-transform:uppercase;letter-spacing:1.5px}
.rfbtn{background:transparent;border:none;color:var(--muted2);cursor:pointer;font-size:13px;padding:2px 6px;border-radius:6px;transition:all .15s;font-family:var(--font)}
.rfbtn:hover{color:var(--accent)}
.rcard{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--rs);padding:14px;margin-bottom:8px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.rcard::after{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:0 2px 2px 0;background:linear-gradient(180deg,var(--accent),var(--pink));opacity:0;transition:opacity .2s}
.rcard:hover{border-color:var(--border2);transform:translateX(2px)}
.rcard:hover::after{opacity:1}
.rcard.flash{animation:cflash .4s ease}
@keyframes cflash{0%{background:var(--ag)}100%{background:var(--surface)}}
.rflag{font-size:26px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}
.rinfo{flex:1;min-width:0}
.rinfo .code{font-size:15px;font-weight:700}
.rinfo .ctry{font-size:11px;color:var(--muted2);margin-top:1px}
.rrt{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.rval{font-family:var(--mono);font-size:18px;font-weight:600;background:linear-gradient(90deg,var(--accent),#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.rrate{font-size:10px;color:var(--muted);font-family:var(--mono)}
.rdel{background:transparent;border:none;color:var(--muted);cursor:pointer;font-size:18px;padding:4px 6px;border-radius:6px;transition:all .15s;line-height:1;margin-left:4px}
.rdel:hover{color:var(--red);background:var(--rg)}
.spark-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px;margin-top:20px}
.spark-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}
.spark-hdr .title{font-size:13px;font-weight:700}
.spark-hdr .sub{font-size:10px;color:var(--muted2);font-family:var(--mono);margin-top:2px}
.spark-pairs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.spbtn{background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600;cursor:pointer;color:var(--muted2);font-family:var(--font);transition:all .15s}
.spbtn.on{background:var(--ag);border-color:var(--accent);color:var(--accent)}
.spark-stats{display:flex;gap:20px;margin-top:10px}
.sstat label{font-size:9px;font-family:var(--mono);color:var(--muted);text-transform:uppercase;letter-spacing:1px}
.sstat .v{font-size:14px;font-weight:700;font-family:var(--mono);margin-top:2px}
.sstat .v.up{color:var(--green)} .sstat .v.dn{color:var(--red)}
.hist-empty{text-align:center;padding:52px 20px;color:var(--muted2)}
.hist-empty .icon{font-size:42px;margin-bottom:14px}
.hist-empty p{font-size:13px;line-height:1.7}
.hitem{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--rs);background:var(--surface);border:1px solid var(--border);margin-bottom:8px;transition:all .15s}
.hitem:hover{border-color:var(--border2)}
.hflags{font-size:20px;letter-spacing:-4px;line-height:1;min-width:42px}
.hinfo{flex:1;min-width:0}
.hpair{font-size:13px;font-weight:700}
.htime{font-size:10px;color:var(--muted);font-family:var(--mono);margin-top:2px}
.hamts{text-align:right}
.hfrom{font-size:11px;color:var(--muted2);font-family:var(--mono)}
.hto{font-size:14px;font-weight:700;font-family:var(--mono);color:var(--accent)}
.clrbtn{display:block;margin:16px auto 0;background:transparent;border:1px solid var(--border);border-radius:8px;padding:8px 20px;font-size:12px;color:var(--muted2);cursor:pointer;font-family:var(--font);transition:all .15s}
.clrbtn:hover{border-color:var(--red);color:var(--red);background:var(--rg)}
.srchwrap{position:relative;margin-bottom:12px}
.srcico{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--muted)}
.srcin{width:100%;background:var(--surface);border:1.5px solid var(--border);border-radius:var(--rs);padding:11px 14px 11px 38px;font-size:14px;color:var(--text);font-family:var(--font);outline:none;transition:border-color .15s}
.srcin:focus{border-color:var(--accent)}
.srcin::placeholder{color:var(--muted)}
.citem{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:var(--rs);cursor:pointer;border:1px solid transparent;transition:all .12s}
.citem:hover{background:var(--surface);border-color:var(--border)}
.citem.fv{background:var(--surface2);border-color:var(--border)}
.citem .fl{font-size:22px}
.citem .ci .code{font-size:14px;font-weight:700}
.citem .ci .nm{font-size:11px;color:var(--muted2)}
.bdg{border-radius:20px;padding:3px 10px;font-size:10px;font-weight:600;font-family:var(--mono)}
.bfv{background:var(--ag);color:var(--accent);border:1px solid rgba(245,200,66,.3)}
.badd{background:transparent;color:var(--muted);border:1px solid var(--border)}
.bbase{background:linear-gradient(90deg,rgba(91,156,246,.15),rgba(232,121,176,.15));color:var(--blue);border:1px solid rgba(91,156,246,.3)}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:100;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);animation:fdi .15s ease}
@keyframes fdi{from{opacity:0}to{opacity:1}}
.modal{background:var(--surface);border:1px solid var(--border2);border-radius:20px 20px 0 0;padding:20px;width:100%;max-width:480px;max-height:72vh;overflow-y:auto;animation:slu .2s ease}
@keyframes slu{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
.mhandle{width:36px;height:4px;background:var(--border2);border-radius:2px;margin:0 auto 16px}
.mtitle{font-size:16px;font-weight:800;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}
.mclose{background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--muted2);cursor:pointer;padding:4px 12px;font-size:16px;line-height:1}
.upd{font-size:10px;font-family:var(--mono);color:var(--muted);text-align:center;padding-top:14px}
.upd span{color:var(--accent);cursor:pointer}
.upd span:hover{text-decoration:underline}
.err{background:var(--rg);border:1px solid rgba(255,90,90,.3);border-radius:var(--rs);padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:12px;font-family:var(--mono)}
.err span{cursor:pointer;text-decoration:underline;opacity:.8}
.empty{text-align:center;padding:40px 20px;color:var(--muted);font-size:13px}
.empty .icon{font-size:36px;margin-bottom:10px}
.skel{background:linear-gradient(90deg,var(--surface) 25%,var(--surface2) 50%,var(--surface) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:6px;height:14px}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
`;

export default function App() {
  const [tab, setTab] = useState("converter");
  const [dark, setDark] = useState(true);
  const [amount, setAmount] = useState("1");
  const [base, setBase] = useState("USD");
  const [favs, setFavs] = useState(DEFAULT_FAVS);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [flashCards, setFlashCards] = useState({});
  const [sparkPair, setSparkPair] = useState(null);
  const [sparkData, setSparkData] = useState({});
  const prevRates = useRef({});

  const fetchRates = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      if (d.result === "error") throw new Error(d["error-type"] || "API error");
      const changed = {};
      Object.keys(d.rates).forEach(k => {
        if (prevRates.current[k] && prevRates.current[k] !== d.rates[k]) changed[k] = true;
      });
      if (Object.keys(changed).length) {
        setFlashCards(changed);
        setTimeout(() => setFlashCards({}), 600);
      }
      prevRates.current = d.rates;
      setRates(d.rates);
      setLastUpdated(new Date());
      const sparks = {};
      CURRENCIES.forEach(c => { if (d.rates[c.code]) sparks[c.code] = generateSparkData(d.rates[c.code]); });
      setSparkData(sparks);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchRates();
    const t = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [fetchRates]);

  useEffect(() => {
    if (!sparkPair && favs.length) setSparkPair(favs.find(f => f !== base) || favs[0]);
  }, [favs, base]);

  const convert = (from, to, amt) => {
    if (!rates[from] || !rates[to]) return null;
    return (parseFloat(amt) / rates[from]) * rates[to];
  };
  const getRate = (from, to) => {
    if (!rates[from] || !rates[to]) return null;
    return rates[to] / rates[from];
  };
  const getCur = (code) => CURRENCIES.find(c => c.code === code);
  const numAmt = parseFloat(amount) || 0;
  const displayFavs = favs.filter(c => c !== base);
  const baseCur = getCur(base);

  const toggleFav = (code) => {
    if (code === base) return;
    setFavs(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const addHistory = (toCode) => {
    const converted = convert(base, toCode, numAmt);
    if (!converted || !numAmt) return;
    setHistory(prev => [{
      id: Date.now(), from: base, to: toCode,
      fromAmt: numAmt, toAmt: converted, time: new Date(),
    }, ...prev].slice(0, 50));
  };

  const sparkOptions = displayFavs.slice(0, 5);
  const activeSpark = sparkPair && sparkOptions.includes(sparkPair) ? sparkPair : sparkOptions[0];
  const sparkRate = activeSpark ? getRate(base, activeSpark) : null;
  const baseUsdRate = rates[base] || 1;
  const sparkRelArr = (sparkData[activeSpark] || []).map(v => v / baseUsdRate);
  const sparkTrend = sparkRelArr.length >= 2
    ? ((sparkRelArr[sparkRelArr.length - 1] - sparkRelArr[0]) / sparkRelArr[0] * 100).toFixed(2)
    : null;

  const filteredAll = CURRENCIES.filter(c => {
    const q = search.toLowerCase();
    return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
  });
  const filteredModal = CURRENCIES.filter(c => {
    const q = modalSearch.toLowerCase();
    return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
  });

  const statusClass = loading ? "loading" : error ? "error" : "";

  return (
    <>
      <style>{CSS}</style>
      <div className={dark ? "" : "lm"}>
        <div className="mesh" />
        <div className="app rel">
          {/* HEADER */}
          <div className="header">
            <div className="logo">
              <div className="logo-icon">✈️</div>
              <div className="logo-text">
                <h1>Cambio<span>Rápido</span></h1>
                <p>tasas en tiempo real</p>
              </div>
            </div>
            <div className="hdr-r">
              <div className="pill">
                <div className={`dot ${statusClass}`} />
                {loading ? "sync..." : error ? "offline" : "live"}
              </div>
              <button className="ibtn" onClick={() => setDark(d => !d)}>{dark ? "☀️" : "🌙"}</button>
            </div>
          </div>

          {/* TABS */}
          <div className="tabs">
            {[["converter","💱 Convertir"],["history","🕘 Historial"],["currencies","🌎 Monedas"]].map(([id,label]) => (
              <button key={id} className={`tab ${tab===id?"active":""}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>

          {/* ── CONVERTER ── */}
          {tab === "converter" && (
            <div className="sec">
              {error && <div className="err">⚠ {error} · <span onClick={fetchRates}>Reintentar</span></div>}

              <div className="base-card">
                <div className="base-top">
                  <div className="bflag">{baseCur?.flag}</div>
                  <div className="bmeta">
                    <div className="code">{base}</div>
                    <div className="ctry">{baseCur?.country}</div>
                  </div>
                  <button className="chbtn" onClick={() => setShowModal(true)}>Cambiar →</button>
                </div>
                <div className="amt-row">
                  <input
                    className="amt-in" type="number" inputMode="decimal"
                    value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
                  />
                </div>
              </div>

              {displayFavs.length === 0 ? (
                <div className="empty"><div className="icon">⭐</div><p>Agrega monedas favoritas en la pestaña "Monedas"</p></div>
              ) : (
                <>
                  <div className="rlbl">
                    <span className="rlabel">Equivalencias</span>
                    <button className="rfbtn" onClick={fetchRates}>↻ Actualizar</button>
                  </div>
                  {displayFavs.map(code => {
                    const cur = getCur(code);
                    if (!cur) return null;
                    const converted = convert(base, code, numAmt);
                    const rate = getRate(base, code);
                    return (
                      <div key={code} className={`rcard ${flashCards[code] ? "flash" : ""}`} onClick={() => addHistory(code)}>
                        <div className="rflag">{cur.flag}</div>
                        <div className="rinfo">
                          <div className="code">{code}</div>
                          <div className="ctry">{cur.country}</div>
                        </div>
                        <div className="rrt">
                          {loading
                            ? <div className="skel" style={{width:80}} />
                            : <>
                                <div className="rval">{converted !== null ? fmt(converted) : "—"}</div>
                                <div className="rrate">1 {base} = {rate !== null ? fmt(rate) : "—"} {code}</div>
                              </>
                          }
                        </div>
                        <button className="rdel" onClick={e => { e.stopPropagation(); toggleFav(code); }}>×</button>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Sparkline */}
              {sparkOptions.length > 0 && (
                <div className="spark-card">
                  <div className="spark-hdr">
                    <div>
                      <div className="title">Tendencia de tasa</div>
                      <div className="sub">simulación 14 períodos · referencial</div>
                    </div>
                  </div>
                  <div className="spark-pairs">
                    {sparkOptions.map(code => (
                      <button key={code} className={`spbtn ${activeSpark===code?"on":""}`} onClick={() => setSparkPair(code)}>
                        {getCur(code)?.flag} {code}
                      </button>
                    ))}
                  </div>
                  {sparkRelArr.length > 1 && (
                    <>
                      <Sparkline data={sparkRelArr} />
                      <div className="spark-stats">
                        <div className="sstat"><label>Tasa actual</label><div className="v">{sparkRate !== null ? fmt(sparkRate) : "—"}</div></div>
                        <div className="sstat"><label>Variación</label><div className={`v ${sparkTrend >= 0 ? "up" : "dn"}`}>{sparkTrend !== null ? `${sparkTrend >= 0 ? "+" : ""}${sparkTrend}%` : "—"}</div></div>
                        <div className="sstat"><label>Par</label><div className="v">{base}/{activeSpark}</div></div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {lastUpdated && (
                <div className="upd">Actualizado {fmtTime(lastUpdated)} · <span onClick={fetchRates}>Refrescar</span></div>
              )}
            </div>
          )}

          {/* ── HISTORY ── */}
          {tab === "history" && (
            <div className="sec">
              {history.length === 0 ? (
                <div className="hist-empty">
                  <div className="icon">🕘</div>
                  <p>Tu historial aparecerá aquí.<br/><br/>Toca cualquier resultado en<br/>"Convertir" para guardarlo.</p>
                </div>
              ) : (
                <>
                  {history.map(h => {
                    const fc = getCur(h.from), tc = getCur(h.to);
                    return (
                      <div key={h.id} className="hitem">
                        <div className="hflags">{fc?.flag}{tc?.flag}</div>
                        <div className="hinfo">
                          <div className="hpair">{h.from} → {h.to}</div>
                          <div className="htime">{fmtTime(h.time)}</div>
                        </div>
                        <div className="hamts">
                          <div className="hfrom">{fmt(h.fromAmt)} {h.from}</div>
                          <div className="hto">{fmt(h.toAmt)} {h.to}</div>
                        </div>
                      </div>
                    );
                  })}
                  <button className="clrbtn" onClick={() => setHistory([])}>🗑 Borrar historial</button>
                </>
              )}
            </div>
          )}

          {/* ── CURRENCIES ── */}
          {tab === "currencies" && (
            <div className="sec">
              <div className="srchwrap">
                <span className="srcico">🔍</span>
                <input className="srcin" placeholder="Buscar moneda o país..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {filteredAll.map(cur => {
                const isFav = favs.includes(cur.code), isBase = cur.code === base;
                return (
                  <div key={cur.code} className={`citem ${isFav?"fv":""}`} onClick={() => !isBase && toggleFav(cur.code)}>
                    <div className="fl">{cur.flag}</div>
                    <div className="ci">
                      <div className="code">{cur.code} · {cur.country}</div>
                      <div className="nm">{cur.name}</div>
                    </div>
                    {isBase ? <span className="bdg bbase">BASE</span>
                      : isFav ? <span className="bdg bfv">★ fav</span>
                      : <span className="bdg badd">+ agregar</span>}
                  </div>
                );
              })}
              {filteredAll.length === 0 && <div className="empty"><div className="icon">🔍</div><p>Sin resultados para "{search}"</p></div>}
            </div>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal">
              <div className="mhandle" />
              <div className="mtitle">
                Moneda base
                <button className="mclose" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="srchwrap">
                <span className="srcico">🔍</span>
                <input className="srcin" placeholder="Buscar..." value={modalSearch} onChange={e => setModalSearch(e.target.value)} autoFocus />
              </div>
              {filteredModal.map(cur => (
                <div key={cur.code} className={`citem ${cur.code===base?"fv":""}`}
                  onClick={() => { setBase(cur.code); setFavs(p => p.filter(c => c !== cur.code)); setSparkPair(null); setShowModal(false); setModalSearch(""); }}>
                  <div className="fl">{cur.flag}</div>
                  <div className="ci">
                    <div className="code">{cur.code} · {cur.country}</div>
                    <div className="nm">{cur.name}</div>
                  </div>
                  {cur.code === base && <span className="bdg bbase">activa</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
