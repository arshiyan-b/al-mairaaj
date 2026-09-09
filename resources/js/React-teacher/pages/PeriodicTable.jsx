import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const CATEGORY_COLORS = {
  "alkali-metal": "#ef7b5a",
  "alkaline-earth": "#f2a65a",
  "transition-metal": "#5aa9e6",
  "post-transition": "#6bc4b8",
  metalloid: "#a6c85a",
  nonmetal: "#4dd0a8",
  halogen: "#d6e05a",
  "noble-gas": "#b98af0",
  lanthanide: "#f06fa0",
  actinide: "#ee5a8a",
  unknown: "#5c6b72",
};

const CATEGORY_LABELS = {
  "alkali-metal": "Alkali metal",
  "alkaline-earth": "Alkaline earth metal",
  "transition-metal": "Transition metal",
  "post-transition": "Post-transition metal",
  metalloid: "Metalloid",
  nonmetal: "Reactive nonmetal",
  halogen: "Halogen",
  "noble-gas": "Noble gas",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
  unknown: "Unknown properties",
};

const CATEGORY_BLURBS = {
  "alkali-metal": "Soft, highly reactive metals that lose a single outer electron easily, forming +1 ions. Never found free in nature.",
  "alkaline-earth": "Reactive metals that lose two outer electrons to form +2 ions. Harder and denser than the alkali metals.",
  "transition-metal": "Hard, dense metals known for multiple oxidation states, catalytic activity, and colorful compounds.",
  "post-transition": "Metals that are softer and lower-melting than the transition metals, sitting just before the metalloids.",
  metalloid: "Elements with properties between metals and nonmetals - many are semiconductors used in electronics.",
  nonmetal: "Poor conductors of heat and electricity, essential to organic chemistry and biological molecules.",
  halogen: "Highly reactive nonmetals that readily gain one electron to form -1 ions, such as in table salt.",
  "noble-gas": "Extremely unreactive gases with a full outer electron shell, used in lighting and inert atmospheres.",
  lanthanide: "Rare-earth metals with similar chemistry, used in magnets, phosphors, and catalysts.",
  actinide: "Radioactive heavy elements; several are synthetic and exist only briefly in laboratories.",
  unknown: "A synthetic, superheavy element - too unstable and short-lived for its properties to be fully measured.",
};

// number, symbol, name, mass, category, period, group, phase
const RAW_ELEMENTS = [
[1,'H','Hydrogen',1.008,'nonmetal',1,1,'gas'],
[2,'He','Helium',4.0026,'noble-gas',1,18,'gas'],
[3,'Li','Lithium',6.94,'alkali-metal',2,1,'solid'],
[4,'Be','Beryllium',9.0122,'alkaline-earth',2,2,'solid'],
[5,'B','Boron',10.81,'metalloid',2,13,'solid'],
[6,'C','Carbon',12.011,'nonmetal',2,14,'solid'],
[7,'N','Nitrogen',14.007,'nonmetal',2,15,'gas'],
[8,'O','Oxygen',15.999,'nonmetal',2,16,'gas'],
[9,'F','Fluorine',18.998,'halogen',2,17,'gas'],
[10,'Ne','Neon',20.180,'noble-gas',2,18,'gas'],
[11,'Na','Sodium',22.990,'alkali-metal',3,1,'solid'],
[12,'Mg','Magnesium',24.305,'alkaline-earth',3,2,'solid'],
[13,'Al','Aluminium',26.982,'post-transition',3,13,'solid'],
[14,'Si','Silicon',28.085,'metalloid',3,14,'solid'],
[15,'P','Phosphorus',30.974,'nonmetal',3,15,'solid'],
[16,'S','Sulfur',32.06,'nonmetal',3,16,'solid'],
[17,'Cl','Chlorine',35.45,'halogen',3,17,'gas'],
[18,'Ar','Argon',39.948,'noble-gas',3,18,'gas'],
[19,'K','Potassium',39.098,'alkali-metal',4,1,'solid'],
[20,'Ca','Calcium',40.078,'alkaline-earth',4,2,'solid'],
[21,'Sc','Scandium',44.956,'transition-metal',4,3,'solid'],
[22,'Ti','Titanium',47.867,'transition-metal',4,4,'solid'],
[23,'V','Vanadium',50.942,'transition-metal',4,5,'solid'],
[24,'Cr','Chromium',51.996,'transition-metal',4,6,'solid'],
[25,'Mn','Manganese',54.938,'transition-metal',4,7,'solid'],
[26,'Fe','Iron',55.845,'transition-metal',4,8,'solid'],
[27,'Co','Cobalt',58.933,'transition-metal',4,9,'solid'],
[28,'Ni','Nickel',58.693,'transition-metal',4,10,'solid'],
[29,'Cu','Copper',63.546,'transition-metal',4,11,'solid'],
[30,'Zn','Zinc',65.38,'transition-metal',4,12,'solid'],
[31,'Ga','Gallium',69.723,'post-transition',4,13,'solid'],
[32,'Ge','Germanium',72.630,'metalloid',4,14,'solid'],
[33,'As','Arsenic',74.922,'metalloid',4,15,'solid'],
[34,'Se','Selenium',78.971,'nonmetal',4,16,'solid'],
[35,'Br','Bromine',79.904,'halogen',4,17,'liquid'],
[36,'Kr','Krypton',83.798,'noble-gas',4,18,'gas'],
[37,'Rb','Rubidium',85.468,'alkali-metal',5,1,'solid'],
[38,'Sr','Strontium',87.62,'alkaline-earth',5,2,'solid'],
[39,'Y','Yttrium',88.906,'transition-metal',5,3,'solid'],
[40,'Zr','Zirconium',91.224,'transition-metal',5,4,'solid'],
[41,'Nb','Niobium',92.906,'transition-metal',5,5,'solid'],
[42,'Mo','Molybdenum',95.95,'transition-metal',5,6,'solid'],
[43,'Tc','Technetium',98,'transition-metal',5,7,'solid'],
[44,'Ru','Ruthenium',101.07,'transition-metal',5,8,'solid'],
[45,'Rh','Rhodium',102.91,'transition-metal',5,9,'solid'],
[46,'Pd','Palladium',106.42,'transition-metal',5,10,'solid'],
[47,'Ag','Silver',107.87,'transition-metal',5,11,'solid'],
[48,'Cd','Cadmium',112.41,'transition-metal',5,12,'solid'],
[49,'In','Indium',114.82,'post-transition',5,13,'solid'],
[50,'Sn','Tin',118.71,'post-transition',5,14,'solid'],
[51,'Sb','Antimony',121.76,'metalloid',5,15,'solid'],
[52,'Te','Tellurium',127.60,'metalloid',5,16,'solid'],
[53,'I','Iodine',126.90,'halogen',5,17,'solid'],
[54,'Xe','Xenon',131.29,'noble-gas',5,18,'gas'],
[55,'Cs','Caesium',132.91,'alkali-metal',6,1,'solid'],
[56,'Ba','Barium',137.33,'alkaline-earth',6,2,'solid'],
[57,'La','Lanthanum',138.91,'lanthanide',8,3,'solid'],
[58,'Ce','Cerium',140.12,'lanthanide',8,4,'solid'],
[59,'Pr','Praseodymium',140.91,'lanthanide',8,5,'solid'],
[60,'Nd','Neodymium',144.24,'lanthanide',8,6,'solid'],
[61,'Pm','Promethium',145,'lanthanide',8,7,'solid'],
[62,'Sm','Samarium',150.36,'lanthanide',8,8,'solid'],
[63,'Eu','Europium',151.96,'lanthanide',8,9,'solid'],
[64,'Gd','Gadolinium',157.25,'lanthanide',8,10,'solid'],
[65,'Tb','Terbium',158.93,'lanthanide',8,11,'solid'],
[66,'Dy','Dysprosium',162.50,'lanthanide',8,12,'solid'],
[67,'Ho','Holmium',164.93,'lanthanide',8,13,'solid'],
[68,'Er','Erbium',167.26,'lanthanide',8,14,'solid'],
[69,'Tm','Thulium',168.93,'lanthanide',8,15,'solid'],
[70,'Yb','Ytterbium',173.05,'lanthanide',8,16,'solid'],
[71,'Lu','Lutetium',174.97,'lanthanide',8,17,'solid'],
[72,'Hf','Hafnium',178.49,'transition-metal',6,4,'solid'],
[73,'Ta','Tantalum',180.95,'transition-metal',6,5,'solid'],
[74,'W','Tungsten',183.84,'transition-metal',6,6,'solid'],
[75,'Re','Rhenium',186.21,'transition-metal',6,7,'solid'],
[76,'Os','Osmium',190.23,'transition-metal',6,8,'solid'],
[77,'Ir','Iridium',192.22,'transition-metal',6,9,'solid'],
[78,'Pt','Platinum',195.08,'transition-metal',6,10,'solid'],
[79,'Au','Gold',196.97,'transition-metal',6,11,'solid'],
[80,'Hg','Mercury',200.59,'transition-metal',6,12,'liquid'],
[81,'Tl','Thallium',204.38,'post-transition',6,13,'solid'],
[82,'Pb','Lead',207.2,'post-transition',6,14,'solid'],
[83,'Bi','Bismuth',208.98,'post-transition',6,15,'solid'],
[84,'Po','Polonium',209,'post-transition',6,16,'solid'],
[85,'At','Astatine',210,'halogen',6,17,'solid'],
[86,'Rn','Radon',222,'noble-gas',6,18,'gas'],
[87,'Fr','Francium',223,'alkali-metal',7,1,'solid'],
[88,'Ra','Radium',226,'alkaline-earth',7,2,'solid'],
[89,'Ac','Actinium',227,'actinide',9,3,'solid'],
[90,'Th','Thorium',232.04,'actinide',9,4,'solid'],
[91,'Pa','Protactinium',231.04,'actinide',9,5,'solid'],
[92,'U','Uranium',238.03,'actinide',9,6,'solid'],
[93,'Np','Neptunium',237,'actinide',9,7,'solid'],
[94,'Pu','Plutonium',244,'actinide',9,8,'solid'],
[95,'Am','Americium',243,'actinide',9,9,'solid'],
[96,'Cm','Curium',247,'actinide',9,10,'solid'],
[97,'Bk','Berkelium',247,'actinide',9,11,'solid'],
[98,'Cf','Californium',251,'actinide',9,12,'solid'],
[99,'Es','Einsteinium',252,'actinide',9,13,'solid'],
[100,'Fm','Fermium',257,'actinide',9,14,'solid'],
[101,'Md','Mendelevium',258,'actinide',9,15,'solid'],
[102,'No','Nobelium',259,'actinide',9,16,'solid'],
[103,'Lr','Lawrencium',266,'actinide',9,17,'solid'],
[104,'Rf','Rutherfordium',267,'transition-metal',7,4,'unknown'],
[105,'Db','Dubnium',268,'transition-metal',7,5,'unknown'],
[106,'Sg','Seaborgium',269,'transition-metal',7,6,'unknown'],
[107,'Bh','Bohrium',270,'transition-metal',7,7,'unknown'],
[108,'Hs','Hassium',269,'transition-metal',7,8,'unknown'],
[109,'Mt','Meitnerium',278,'unknown',7,9,'unknown'],
[110,'Ds','Darmstadtium',281,'unknown',7,10,'unknown'],
[111,'Rg','Roentgenium',282,'unknown',7,11,'unknown'],
[112,'Cn','Copernicium',285,'transition-metal',7,12,'unknown'],
[113,'Nh','Nihonium',286,'post-transition',7,13,'unknown'],
[114,'Fl','Flerovium',289,'post-transition',7,14,'unknown'],
[115,'Mc','Moscovium',290,'post-transition',7,15,'unknown'],
[116,'Lv','Livermorium',293,'post-transition',7,16,'unknown'],
[117,'Ts','Tennessine',294,'halogen',7,17,'unknown'],
[118,'Og','Oganesson',294,'noble-gas',7,18,'unknown'],
];

const ELEMENTS = RAW_ELEMENTS.map(([num, sym, name, mass, cat, period, group, phase]) => ({
  num, sym, name, mass, cat, period, group, phase,
}));

const PLACEHOLDERS = [
  { period: 6, group: 3, label: "57-71" },
  { period: 7, group: 3, label: "89-103" },
];

const ROW_MAP = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 9, 9: 10 };

function Tile({ el, index, dimmed, selected, onSelect }) {
  const color = CATEGORY_COLORS[el.cat];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85, y: 6 }}
      animate={{ opacity: dimmed ? 0.15 : 1, scale: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.004, 0.4), duration: 0.35 }}
      whileHover={{ y: -3, boxShadow: "0 10px 22px rgba(0,0,0,0.35)", zIndex: 2 }}
      onClick={() => onSelect(el)}
      style={{
        gridRow: ROW_MAP[el.period],
        gridColumn: el.group,
        borderLeft: `3px solid ${color}`,
        boxShadow: selected ? `0 0 0 2px ${color}` : undefined,
      }}
      className="relative flex cursor-pointer flex-col justify-between rounded-lg border border-slate-700 bg-slate-800 p-1.5"
    >
      <div className="font-mono text-[9px] text-white/50">{el.num}</div>
      <div className="text-[15px] font-bold leading-none text-white">{el.sym}</div>
      <div className="truncate text-[8px] text-white/60">{el.name}</div>
    </motion.div>
  );
}

function DetailOverlay({ el, onClose }) {
  if (!el) return null;

  const color = CATEGORY_COLORS[el.cat];
  const periodLabel =
    el.period > 7 ? (el.period === 8 ? "6 (lanthanide series)" : "7 (actinide series)") : el.period;

  const stats = [
    ["Atomic Mass", el.mass + " u"],
    ["Period", periodLabel],
    ["Group", el.group],
    ["Phase (room temp)", el.phase.charAt(0).toUpperCase() + el.phase.slice(1)],
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 12 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 transition hover:rotate-90 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-7 flex items-center gap-6">
          <motion.div
            initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl text-6xl font-bold"
            style={{ backgroundColor: color + "22", color }}
          >
            {el.sym}
          </motion.div>
          <div>
            <div className="font-mono text-xs tracking-wide text-slate-400">ATOMIC NO. {el.num}</div>
            <h2 className="mb-2 mt-1 text-2xl font-bold text-white">{el.name}</h2>
            <span
              className="inline-block rounded-full px-3 py-1 font-mono text-[11px] tracking-wide"
              style={{ backgroundColor: color + "22", color }}
            >
              {CATEGORY_LABELS[el.cat]}
            </span>
          </div>
        </div>

        <p className="mb-6 border-b border-slate-700 pb-6 text-sm leading-relaxed text-slate-400">
          {CATEGORY_BLURBS[el.cat]}
        </p>

        <dl className="grid grid-cols-2 gap-5">
          {stats.map(([label, value], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + i * 0.06 }}
            >
              <dt className="mb-1 font-mono text-[10.5px] tracking-wide text-slate-400">{label}</dt>
              <dd className="text-lg font-semibold text-white">{value}</dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>
    </motion.div>
  );
}

export default function PeriodicTable() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [selected, setSelected] = useState(null);

  const q = query.trim().toLowerCase();

  const isDimmed = (el) => {
    const matchesQuery =
      !q || el.name.toLowerCase().includes(q) || el.sym.toLowerCase() === q || el.sym.toLowerCase().startsWith(q);
    const matchesCategory = !activeCategory || el.cat === activeCategory;
    return !(matchesQuery && matchesCategory);
  };

  return (
    <div className="-mx-4 -my-6 min-h-screen bg-slate-900 px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs tracking-wide text-teal-400">AL MAIRAAJ &middot; SIMULATORS</div>
            <h1 className="mt-1 text-2xl font-bold text-white">Periodic Table of Elements</h1>
          </div>
          <input
            type="text"
            placeholder="Search by name or symbol&hellip;"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 border-b border-slate-800 pb-4 text-xs text-slate-400">
          {Object.keys(CATEGORY_LABELS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory((prev) => (prev === key ? null : key))}
              className="flex items-center gap-1.5 transition-opacity"
              style={{ opacity: activeCategory && activeCategory !== key ? 0.3 : 1 }}
            >
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[key] }} />
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-6">
          <div
            className="mx-auto grid min-w-[900px] gap-1"
            style={{ gridTemplateColumns: "repeat(18, minmax(46px, 1fr))", gridAutoRows: "minmax(46px, 1fr)" }}
          >
            {ELEMENTS.map((el, i) => (
              <Tile
                key={el.num}
                el={el}
                index={i}
                dimmed={isDimmed(el)}
                selected={selected?.num === el.num}
                onSelect={setSelected}
              />
            ))}
            {PLACEHOLDERS.map((p) => (
              <div
                key={p.label}
                className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 font-mono text-[11px] text-slate-500"
                style={{ gridRow: p.period, gridColumn: p.group }}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <p className="pb-6 text-center font-mono text-xs text-slate-500">
          Click any element to see its details &middot; 118 elements
        </p>
      </div>

      <AnimatePresence>
        {selected && <DetailOverlay el={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}