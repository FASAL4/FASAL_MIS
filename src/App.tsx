import React, { useState, useMemo, useEffect } from "react";
import {
  Database,
  Users,
  Map,
  TrendingUp,
  FileText,
  Calendar,
  Award,
  Leaf,
  BarChart3,
  Search,
  Filter,
  BookOpen,
  IndianRupee,
  Activity,
  ArrowRight,
  X,
  Download,
  ClipboardCheck,
  Tag,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Target,
  Moon,
  Sun
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

// Aggregated mock data based on the MIS training files (2022-2025)

import farmersData from "./data/farmers.json";
import leverageData from "./data/leverage.json";

import { Dashboard } from "./components/Dashboard";

const recentFarmers = farmersData;

const stories = [
  { id: 1, name: "Rajkumari Devi", village: "Kailash Nagar", title: "From Wage Labour to Leading Farmer", description: "Transitioned from daily wage labor to earning ₹60,000 net income from turmeric and arbi intercropping on less than one bigha. She now cultivates Bananas on two bighas and has inspired 137 other farmers.", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", tags: ["Turmeric Adoption", "Economic Transformation", "LEISA"] },
  { id: 2, name: "Anarkali", village: "Rampurwa, Fakirpuri", title: "AAS Treasurer & Organic Pioneer", description: "Overcame social discrimination to lead advocacy for PDS and MGNREGA rights. Pioneered climate-resilient natural farming based on low external input sustainable agriculture (LEISA).", icon: Leaf, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", tags: ["Social Empowerment", "Right to Entitlements", "LEISA"] },
  { id: 3, name: "Manju", village: "Program Village", title: "Struggle to Self-Reliance & Leadership", description: "Joined an SHG in 2016 facing community taunts. Took the risk of planting sugarcane in flood-prone 'khala' land, achieving financial independence and becoming a beacon of empowerment for other women.", icon: Award, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", tags: ["Social Empowerment", "Leadership", "Financial Independence"] },
  { id: 4, name: "Shanti", village: "Program Village", title: "Overcoming Abuse to Educate the Next Gen", description: "A survivor of child marriage and domestic abuse who found strength and belonging through AAS and Manju's mentorship. She is the first in her village to send her daughter to Kasturba School.", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", tags: ["Child Education", "Social Empowerment", "Mentorship"] }
];

const storyDetails: Record<number, { text: React.ReactNode, title: string }> = {
  1: {
    title: "Rajkumari Devi - From Wage Labour to a Leading Woman Farmer",
    text: (
      <div className="space-y-4 text-slate-700">
        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Introduction and Background</h3>
        <p>Rajkumari Devi is a resident of Kailash Nagar village in Mihinpurwa block of Bahraich district, Uttar Pradesh. For many years, she supported her family through daily wage labour as the small plot of agricultural land owned by the household did not generate sufficient income. Farming was practiced using traditional methods and largely remained a subsistence activity rather than a reliable livelihood source.</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">The Challenge: Limited Agricultural Productivity</h3>
        <p>Before engaging with the programme, agriculture in Rajkumari Devi’s household was characterised by low productivity and limited diversification. Traditional cultivation methods were followed without systematic soil management, crop planning, or improved cultivation practices. The income generated from farming was insufficient to meet household needs.</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Programme Intervention: Training and Sustainable Agriculture Practices</h3>
        <p>Her farming journey began to change when she became associated with DEHAT, which was facilitating farmer trainings and demonstrations on sustainable agricultural practices. She learned improved cultivation practices, including seed treatment, soil fertility management, mulching techniques, and crop diversification strategies.</p>
        <p>She adopted organic nutrient inputs such as Jeevamrit and Cow Dung Manure (Gobar Khad) to improve soil fertility and began using mulching techniques to conserve soil moisture and suppress weeds.</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Economic Transformation: Adoption of Turmeric Cultivation</h3>
        <p>A major turning point came when she experimented with Turmeric Cultivation on a small plot measuring less than one bigha. Using improved seed, organic nutrient management, and better crop planning, she cultivated turmeric while simultaneously adopting intercropping with Arbi (Colocasia). This experiment resulted in a net income of approximately ₹60,000 from turmeric cultivation alone.</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Leadership and Community Influence</h3>
        <p>Alongside economic improvement, her confidence and leadership grew. She now actively participates in Gram Sabha meetings and village-level discussions, sharing her experiences with other farmers. Her commitment has been recognised locally, and she has received appreciation certificates from district authorities.</p>
      </div>
    )
  },
  2: {
    title: "Anarkali - From Social Discrimination to Leadership",
    text: (
      <div className="space-y-4 text-slate-700">
        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Introduction and Background</h3>
        <p>Anarkali is a resident of Rampurwa village, Fakirpuri Post, currently serving as the Treasurer of the Sadhana Azadi Aajivika Adhikar Sangathan (AAS). As a member of a tribal community, her early life was shaped by deep social discrimination and structural inequalities. In her community, women were rarely made aware of their rights and were provided very limited opportunities.</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">The Path to Leadership: DEHAT and AAS</h3>
        <p>Anarkali’s leadership potential was first recognised by DEHAT, which provided her with an opportunity to engage in community processes. Joining AAS proved to be a turning point. She realised that social change requires organised efforts and collective struggle. Gradually, she began raising her voice in community forums.</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Struggles for Social and Government Rights</h3>
        <p>She played a key role in advocating for the community’s access to essential government welfare schemes. She raised concerns about irregularities in the Public Distribution System (PDS) and helped establish monitoring mechanisms. She also actively advocated for improved implementation of the MGNREGA programme and ensured poor households were included in government housing schemes (Awas Yojana).</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Pioneering Climate Resilient Natural Farming</h3>
        <p>Traditionally, farmers in her village relied heavily on chemical fertilisers. Taking initiative, she began promoting climate-resilient, low external input sustainable agriculture (LEISA). She adopted natural farming methods on her own land and demonstrated that these practices could improve crop productivity while protecting soil health.</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Conclusion</h3>
        <p>Today, Anarkali is widely respected as a grassroots leader and an inspiration. Her journey—from a woman constrained by fear and discrimination to a confident community leader—illustrates the transformative potential of collective organisation and local leadership.</p>
      </div>
    )
  },
  3: {
    title: "Manju - A Story of Struggle and Self-Reliance",
    text: (
      <div className="space-y-4 text-slate-700">
        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">The Beginning: A Fire Within (2016)</h3>
        <p>"The village mornings were always full of dust and hopes. In that same village, an ordinary woman made the decision to join a Self-Help Group in the year 2016. People used to laugh—'What will happen with this? How much will you earn?' But there was a fire in the mind. The start of changing something was not easy."</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">The Early Challenges: Taunts and Paperwork</h3>
        <p>"Many times the people of the village used to taunt—What did you get by forming a group? Do housework, that is better.' The income was very low; sometimes the month would pass on 1000 rupees or 2000 rupees, but the pocket remained empty. However, courage did not break."</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">The Turning Point: Learning and Confidence</h3>
        <p>"Slowly, slowly, I learned how to get people to sign. I learned to talk to people. I learned to step out of the house. Where there was hesitation before, now there was self-confidence. The struggle was not just for money—it was for respect, for identity, for proving to oneself that we too can do something."</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Taking the Risk: Sugarcane and DEHAT</h3>
        <p>"We have a total of three bighas of land. Two bighas were in the khala (low-lying area). The risk in the khala land was very high... But we had so much courage that we could take a risk. We decided that we will plant sugarcane in all three bighas. Sugarcane is such a crop that can bear water and also give a good income... Water did come into the khala land, but the sugarcane bore it."</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Conclusion: The Real Victory</h3>
        <p>"Small savings of the group gave birth to big dreams... This journey from 2016 until today was not just about earning money; this journey was about becoming self-reliant. And the story has not ended yet, because the real victory is the one that is found through struggle."</p>
      </div>
    )
  },
  4: {
    title: "Shanti - Overcoming Abuse to Educate the Next Gen",
    text: (
      <div className="space-y-4 text-slate-700">
        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">Childhood and the Loss of a Father</h3>
        <p>"Papa passed away a long time ago. At that time, we were very small. After Papa left, our whole world changed... Mummy worked very hard to educate us... She worked herself but never let us do manual labor. She never let our hands leave our books."</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">The Trap of Child Marriage & Dark Years</h3>
        <p>"I was married off at a very young age... After reaching my in-laws' house, my sorrows increased. I didn’t find love or belonging there. Every day was spent in taunts, insults, and pain... I had to bear physical and mental torture. Because my periods didn't come on time, I was called insulting words like 'Kinnar'."</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">Abandonment and The Gift of Motherhood</h3>
        <p>"My husband left me and went away... Later he came back, and we had two children, but I lost both of them in the middle of struggles. To be a mother and lose your children is the greatest sorrow. Then, a woman gave birth to a girl and died. I decided to adopt that little girl... I accepted her from my heart without thinking about what society would say."</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">The Intervention: Meeting Manju and DEHAT</h3>
        <p>"Inside the house, the same chaos and violence continued... An NGO came to our village. When I went and came back, my husband beat me a lot. But there I met a woman from the village whose name was Manju. She understood my pain and assured me 'We will move forward like this; you are not alone.' With her support, I started getting involved."</p>

        <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 mt-6">The Result: A Story of Progress</h3>
        <p>"Through Manju, I got the chance to understand the outside world. Now I can read and write... Manju and I are the first women of the village who have sent our daughters to the Kasturba School. Now I am not afraid of anyone. I have started feeling that my life is now not just a story of pain, but a story of emerging from struggle and moving forward."</p>
      </div>
    )
  }
};

type BreakdownType = 'farmers' | 'aas' | 'funds' | 'turmeric' | null;

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [selectedBreakdown, setSelectedBreakdown] = useState<BreakdownType>(null);
  const [isAnalyzingKPI, setIsAnalyzingKPI] = useState(false);
  const [storySearchQuery, setStorySearchQuery] = useState("");
  const [selectedStoryTag, setSelectedStoryTag] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState<"All" | "M" | "F">("All");

  const totalLeverageAmount = 82500000;

  const formattedLeverage = useMemo(() => {
    if (totalLeverageAmount >= 10000000) {
      return `₹${(totalLeverageAmount / 10000000).toFixed(2)} Cr`;
    } else if (totalLeverageAmount >= 100000) {
      return `₹${(totalLeverageAmount / 100000).toFixed(2)} L`;
    }
    return `₹${totalLeverageAmount.toLocaleString('en-IN')}`;
  }, [totalLeverageAmount]);

  // Data for Doughnut Chart
  const genderRepresentationData = useMemo(() => {
    const maleCount = farmersData.filter((f: any) => f.gender === 'M').length;
    const femaleCount = farmersData.filter((f: any) => f.gender === 'F').length;
    return [
      { name: 'Female', value: femaleCount, fill: '#0d9488' },
      { name: 'Male', value: maleCount, fill: '#334155' }
    ];
  }, []);

  // Data for Density Map
  const densityMapData = useMemo(() => {
    const counts: Record<string, number> = {};
    farmersData.forEach((f: any) => {
      if (f.village) {
        // Simple normalization
        let v = String(f.village).trim();
        if (v.toLowerCase() === 'baajpur bankati') v = 'Bajpur Bankati';
        counts[v] = (counts[v] || 0) + 1;
      }
    });
    // Pick top 6 areas to represent the "6 Gram Panchayats"
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([village, count]) => ({ village, count }));
    return sorted;
  }, []);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [readProgress, setReadProgress] = useState(0);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredFarmers = useMemo(() => {
    let result = recentFarmers.filter(f => {
      const nameMatch = String(f.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const villageMatch = String(f.village || "").toLowerCase().includes(searchQuery.toLowerCase());
      const idMatch = String(f.id || "").toLowerCase().includes(searchQuery.toLowerCase());
      const groupMatch = String(f.group || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || villageMatch || idMatch || groupMatch;
      const matchesGender = filterGender === "All" ? true : f.gender === filterGender;
      return matchesSearch && matchesGender;
    });

    if (sortConfig !== null) {
      result.sort((a, b) => {
        let aVal = (a as any)[sortConfig.key];
        let bVal = (b as any)[sortConfig.key];

        // Handle undefined/null values
        if (aVal === undefined || aVal === null) aVal = "";
        if (bVal === undefined || bVal === null) bVal = "";

        // Handle numeric sorting for specific columns
        if (sortConfig.key === 'totalLand') {
          const numA = parseFloat(aVal) || 0;
          const numB = parseFloat(bVal) || 0;
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchQuery, filterGender, sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterGender]);

  const paginatedFarmers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredFarmers.slice(start, start + rowsPerPage);
  }, [filteredFarmers, currentPage]);

  const totalPages = Math.ceil(filteredFarmers.length / rowsPerPage);

  const handleExportCSV = () => {
    const headers = ["Farmer ID", "Name", "Gender", "Village", "AAS Group", "Active Years", "Total Land (Acres)"];
    const rows = filteredFarmers.map((f: any) => [f.id, f.name, f.gender, f.village, f.group, f.year, f.totalLand || '-']);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "farmers_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKPISelect = (type: BreakdownType) => {
    setSelectedBreakdown(type);
    setIsAnalyzingKPI(true);
    setTimeout(() => setIsAnalyzingKPI(false), 1500);
  };

  const renderBreakdownModal = () => {
    if (!selectedBreakdown) return null;

    let content = null;
    let title = "";

    switch (selectedBreakdown) {
      case 'farmers':
        title = "Farmer Families Breakdown";
        content = (
          <div className="space-y-4">
            <p className="text-slate-600">The FASAL program works across 6 Gram Panchayats encompassing 20 villages.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-2">Gram Panchayats</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                  <li>Fakirpuri</li>
                  <li>Vishunapur</li>
                  <li>Chahalwa</li>
                  <li>Karikot</li>
                  <li>Bajpur Bankati</li>
                  <li>Barkharia</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-800 mb-2">Cumulative Growth</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex justify-between border-b pb-1"><span>2022</span> <span className="font-medium">850 Farmers</span></li>
                  <li className="flex justify-between border-b pb-1"><span>2023</span> <span className="font-medium">1,200 Farmers</span></li>
                  <li className="flex justify-between border-b pb-1"><span>2024</span> <span className="font-medium">1,350 Farmers</span></li>
                  <li className="flex justify-between font-semibold text-teal-700"><span>2025</span> <span>1,500+ Farmers</span></li>
                </ul>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800 mt-4">
              <HelpCircle size={18} className="shrink-0 mt-0.5 text-blue-600" />
              <p><strong>Insight:</strong> This total was calculated by identifying unique farmer IDs across all yearly datasets (2022-2025). The program scaled progressively across the intervention period.</p>
            </div>
          </div>
        );
        break;
      case 'aas':
        title = "AAS Groups & Institutional Structure";
        content = (
          <div className="space-y-4">
            <p className="text-slate-600">The institutional structure experienced a consolidation phase, streamlining groups from 80 loosely formed ones to 74 highly active functioning groups.</p>
            <div className="bg-white border text-sm rounded-lg overflow-hidden">
              <div className="flex bg-slate-50 p-3 font-semibold border-b"><div className="w-1/3">Level</div><div className="w-2/3">Count & Representation</div></div>
              <div className="flex p-3 border-b"><div className="w-1/3 font-medium">Village Level</div><div className="w-2/3">74 Aajeevika Adhikar Sangathans (AAS)</div></div>
              <div className="flex p-3 border-b"><div className="w-1/3 font-medium">Cluster Level</div><div className="w-2/3">5 Clusters</div></div>
              <div className="flex p-3"><div className="w-1/3 font-medium">Block Level</div><div className="w-2/3">1 Block Level Federation (BLF)</div></div>
            </div>
            <p className="text-sm text-slate-600 italic mt-2">These platforms are utilized for documenting issues, preparing written MNREGA work demands, and escalating issues through district-level interface meetings.</p>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800 mt-4">
              <HelpCircle size={18} className="shrink-0 mt-0.5 text-blue-600" />
              <p><strong>Insight:</strong> The institutional structure consolidated groups over time, deriving exactly 74 unique entities across the villages after standardizing the data.</p>
            </div>
          </div>
        );
        break;
      case 'funds':
        title = "Government Convergence & Funding Leveraging";
        content = (
          <div className="space-y-4">
            <p className="text-slate-600">Communities successfully accessed approximately {formattedLeverage} worth of schemes and infrastructure across the years.</p>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-4 py-3">Year</th><th className="px-4 py-3 text-right">Amount Leveraged (₹)</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-amber-50 font-semibold"><td className="px-4 py-3 text-amber-900">Total Validated Convergence (2023-2025)</td><td className="px-4 py-3 text-right font-mono text-amber-900">{totalLeverageAmount.toLocaleString('en-IN')}</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-2">Major Contributions:</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li><strong>Housing (PM Awas):</strong> Significant allocations directed towards individual housing infrastructure.</li>
                <li><strong>Water Infrastructure:</strong> Large scale 'Har Ghar Nal' schemes driving massive convergence in 2024 & 2025.</li>
                <li><strong>Sanitation & Agriculture:</strong> Ongoing support for NADEP pits, latrines, and local farm infrastructure.</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800 mt-4">
              <HelpCircle size={18} className="shrink-0 mt-0.5 text-blue-600" />
              <p><strong>Insight:</strong> The records across 2023, 2024, and 2025 leverages show a cumulative validated convergence of {totalLeverageAmount.toLocaleString('en-IN')}.</p>
            </div>
          </div>
        );
        break;
      case 'turmeric':
        title = "Turmeric Cultivation Adoption Insights (Corrected)";
        content = (
          <div className="space-y-4">
            <p className="text-slate-600">The program has deliberately shifted farmers from High External Input (HEISA) models to Low External Input Sustainable Agriculture (LEISA) models using organic pest management and specialized crops. <strong>Note: Previously reported 137 farmers / ₹34,202 avg income was incorrect.</strong> Corrected figures from DEHAT_Dash.xlsx below.</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-violet-50 p-4 rounded-lg border border-violet-100 flex flex-col justify-center items-center text-center">
                <span className="text-sm font-semibold text-violet-700 uppercase tracking-widest mb-1">Turmeric Farmers</span>
                <span className="text-3xl font-bold text-violet-900">112</span>
                <span className="text-xs text-violet-500 mt-1">(Sheet3 crop data)</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex flex-col justify-center items-center text-center">
                <span className="text-sm font-semibold text-emerald-700 uppercase tracking-widest mb-1">Avg Net Income</span>
                <span className="text-3xl font-bold text-emerald-900">₹20,679</span>
                <span className="text-xs text-emerald-500 mt-1">per farmer</span>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex flex-col justify-center items-center text-center">
                <span className="text-sm font-semibold text-amber-700 uppercase tracking-widest mb-1">Turmeric + Ginger</span>
                <span className="text-3xl font-bold text-amber-900">178</span>
                <span className="text-xs text-amber-500 mt-1">combined farmers</span>
              </div>
            </div>
            <div className="bg-white border text-sm rounded-lg overflow-hidden">
              <div className="flex p-3 border-b"><div className="w-2/5 font-medium bg-slate-50 rounded-md px-2 py-1 mr-2">Total Net Income (Turmeric)</div><div className="w-3/5 py-1">₹23,16,000 (Sheet3) / ₹21,01,022 (Sheet2)</div></div>
              <div className="flex p-3 border-b"><div className="w-2/5 font-medium bg-slate-50 rounded-md px-2 py-1 mr-2">Cultivation Area</div><div className="w-3/5 py-1">6.91 acres</div></div>
              <div className="flex p-3 border-b"><div className="w-2/5 font-medium bg-slate-50 rounded-md px-2 py-1 mr-2">Income per Acre</div><div className="w-3/5 py-1">₹3,35,166</div></div>
              <div className="flex p-3"><div className="w-2/5 font-medium bg-slate-50 rounded-md px-2 py-1 mr-2">Key LEISA Practices</div><div className="w-3/5 py-1">Seed treatment, organic mulching, Jeevamrit & Cow Dung Manure, Intercropping with Arbi/Vegetables.</div></div>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800 mt-4">
              <HelpCircle size={18} className="shrink-0 mt-0.5 text-blue-600" />
              <p><strong>Insight:</strong> Corrected figures from DEHAT_Dash.xlsx Sheet3 (crop details) and Sheet2 (farmer cost/income). The old 137/₹34,202 came from a single MIS row. Combined turmeric + ginger reach is 178 farmers with ₹27,06,000 total income.</p>
            </div>
          </div>
        );
        break;
    }

    return (
      <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-500" />
              {title}
            </h3>
            <button
              onClick={() => setSelectedBreakdown(null)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            {isAnalyzingKPI ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-4">
                <RefreshCw className="animate-spin text-indigo-500" size={36} />
                <p className="text-[15px] font-medium animate-pulse text-indigo-600/80">Analyzing raw survey data...</p>
              </div>
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleStoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight > 0) {
      const progress = (target.scrollTop / scrollHeight) * 100;
      setReadProgress(progress);
    }
  };

  const renderStoryModal = () => {
    if (selectedStory === null) return null;
    const story = storyDetails[selectedStory];
    if (!story) return null;

    return (
      <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 relative">
            <div className="absolute bottom-0 left-0 h-1 bg-teal-500 transition-all duration-150 ease-out" style={{ width: `${readProgress}%` }} />
            <div>
              <h3 className="text-xl font-bold text-slate-800">{story.title}</h3>
            </div>
            <button
              onClick={() => setSelectedStory(null)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors ml-4 relative z-10"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="p-8 overflow-y-auto flex-1 bg-white relative" onScroll={handleStoryScroll}>
            {story.text}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
            <Leaf size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">FASAL MIS</h1>
            <p className="text-xs text-slate-400">FDI Data Studio</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-teal-500/10 text-teal-400" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <BarChart3 size={18} />
            RF Outcomes
          </button>
          <button
            onClick={() => setActiveTab("farmers")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "farmers" ? "bg-teal-500/10 text-teal-400" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <Users size={18} />
            Farmer Registry
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "reports" ? "bg-teal-500/10 text-teal-400" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <FileText size={18} />
            Grant Reports & FDI
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "audit" ? "bg-amber-500/10 text-amber-400" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <ClipboardCheck size={18} />
            Data Audit Report
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "stories" ? "bg-teal-500/10 text-teal-400" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <BookOpen size={18} />
            Stories of Change
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-400">
            <Database size={14} className="text-teal-500" />
            V2 Context Loaded
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {renderStoryModal()}
        {renderBreakdownModal()}

        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0 h-20">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeTab === "dashboard" && "Results Framework & Outcomes"}
              {activeTab === "farmers" && "Farmer Training MIS"}
              {activeTab === "reports" && "FDI & Grant Reports"}
              {activeTab === "stories" && "Stories of Change"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Data aggregated from FASAL MIS (2022-2025), Exposure Visits, and Grant Reports.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === "farmers" && (
              <div className="flex items-center gap-4 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, code, village..."
                    className="pl-9 pr-4 py-2 bg-slate-100 border border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none rounded-lg text-sm w-64 transition-all"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 rounded-lg transition-colors border ${isFilterOpen || filterGender !== "All" ? "border-teal-500 text-teal-700 bg-teal-50" : "border-slate-200 text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100"}`}
                  >
                    <Filter size={18} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 shadow-lg rounded-xl z-10 p-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Filter By Gender</h4>
                      <div className="space-y-1">
                        {["All", "M", "F"].map(gender => (
                          <button
                            key={gender}
                            onClick={() => { setFilterGender(gender as any); setIsFilterOpen(false); }}
                            className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${filterGender === gender ? "bg-teal-50 text-teal-700 font-medium" : "hover:bg-slate-50 text-slate-700"}`}
                          >
                            {gender === "All" ? "Both Genders" : gender === "M" ? "Male (M)" : "Female (F)"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg transition-colors border border-slate-200 text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center justify-center"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 h-full">
          {activeTab === "dashboard" && (
            <div className="max-w-6xl mx-auto pb-12">
              <Dashboard farmersData={farmersData} totalLeverageAmount={totalLeverageAmount} />
            </div>
          )}

          {activeTab === "farmers" && (
            <div className="max-w-6xl mx-auto pb-12">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Complete Master List</h3>
                    <p className="text-xs text-slate-500 mt-1">Showing {filteredFarmers.length} of {recentFarmers.length} loaded records</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-50 transition-colors select-none" onClick={() => handleSort('id')}>
                          Code {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-50 transition-colors select-none" onClick={() => handleSort('name')}>
                          Farmer Name {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="px-6 py-4 font-semibold text-center cursor-pointer hover:bg-slate-50 transition-colors select-none" onClick={() => handleSort('gender')}>
                          Gender {sortConfig?.key === 'gender' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-50 transition-colors select-none" onClick={() => handleSort('village')}>
                          Panchayat & Village {sortConfig?.key === 'village' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-50 transition-colors select-none" onClick={() => handleSort('group')}>
                          AAS Group {sortConfig?.key === 'group' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-50 transition-colors select-none" onClick={() => handleSort('year')}>
                          Recorded Years {sortConfig?.key === 'year' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-50 transition-colors select-none" onClick={() => handleSort('totalLand')}>
                          Total Land (Acres) {sortConfig?.key === 'totalLand' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedFarmers.length > 0 ? (
                        paginatedFarmers.map((farmer: any) => (
                          <tr key={farmer.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{farmer.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">{farmer.name}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center w-6 h-6 justify-center rounded-full text-xs font-semibold ${farmer.gender === 'M' ? 'bg-blue-100 text-blue-700' : farmer.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'}`}>
                                {farmer.gender ? farmer.gender.charAt(0) : '?'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              <div className="font-medium text-slate-800">{farmer.village || farmer.panchayat || "Mihinpurwa"}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{farmer.panchayat ? `Panchayat: ${farmer.panchayat}` : 'Block: Mihinpurwa'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium border border-teal-100">
                                {farmer.group}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{farmer.year}</td>
                            <td className="px-6 py-4 text-slate-600 font-mono">{farmer.totalLand || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            No farmers match your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredFarmers.length)} of {filteredFarmers.length}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-white border border-slate-300 rounded text-sm text-slate-700 disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-white border border-slate-300 rounded text-sm text-slate-700 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="max-w-4xl mx-auto space-y-6 pb-12">

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Grant Report (2024-2025)</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Comprehensive report highlighting the progression of the FASAL programme. Showcases the consolidation of AAS groups to 74, massive convergence of public funds (₹2.8 Cr), and active empowerment of women facilitators. Details major shifts towards peer-led leadership and low-external-input sustainable agriculture (LEISA).
                    </p>
                    <div className="flex gap-3">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded w-fit">Status: Submitted</span>
                      <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded w-fit border border-emerald-200">Analyzed & Indexed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Map size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Exposure Visit Report (VAAGDHARA)</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Jan 2026 visit to Banswara, Rajasthan involving 20 Krishi Mitras and DEHAT leadership. Focused on learning 'True Governance', 'True Farming' and 'True Childhood'. Showcases adoptions like Mansingh’s 1-acre integrated farm (biogas, dairy, crops), community seed banks by the Saksham Group, and Ramanlal Panki's goat-based livelihoods with Sirohi breed goats.
                    </p>
                    <div className="flex gap-3">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded w-fit">Type: Field Exposure</span>
                      <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded w-fit border border-emerald-200">Analyzed & Indexed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Self-Assessment Report</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Highlights program challenges and adaptations. Details overcoming high staff attrition due to human-animal conflicts and shifting from high external input dependency to natural agriculture. Tracks deep governance hurdles including historical exploitation by Forest Departments (Tihai extortion) and corruption.
                    </p>
                    <div className="flex gap-3">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded w-fit">Type: Outcomes Evaluation</span>
                      <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded w-fit border border-emerald-200">Analyzed & Indexed</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === "audit" && (
            <div className="max-w-6xl mx-auto pb-12 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardCheck className="text-amber-500" size={24} />
                      Data Quality Audit Report
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Automated analysis of DEHAT_Cleaned_Data.csv against standardized FDI tracking indicators.
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={14} /> Attention Required
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Insight 1 */}
                  <div className="flex gap-4">
                    <div className="mt-1 bg-red-100 text-red-600 p-2 rounded-lg shrink-0 h-fit">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1">Missing Target Data Points: Gender</h4>
                      <p className="text-sm text-slate-600 mb-3">
                        The `DEHAT_Cleaned_Data.csv` does not explicitly contain a standardized 'Gender' or 'Sex' column, leaving the current visualization fallback to unknown (?).
                      </p>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-500">
                        Affected Records: 1,109 / 1,109 (100%)
                      </div>
                    </div>
                  </div>

                  {/* Insight 2 */}
                  <div className="flex gap-4">
                    <div className="mt-1 bg-amber-100 text-amber-600 p-2 rounded-lg shrink-0 h-fit">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1">Inconsistent Identifiers</h4>
                      <p className="text-sm text-slate-600 mb-3">
                        Farmer IDs are derived from `your phone number`. Many entries have blank phone numbers, causing the system to auto-generate pseudo IDs (e.g., `FRM00004`). This will break identity reconciliation across years.
                      </p>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-500">
                        Affected Records: ~340 / 1,109 missing phone numbers
                      </div>
                    </div>
                  </div>

                  {/* Insight 3 */}
                  <div className="flex gap-4">
                    <div className="mt-1 bg-amber-100 text-amber-600 p-2 rounded-lg shrink-0 h-fit">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1">Unstandardized Entity Names</h4>
                      <p className="text-sm text-slate-600 mb-3">
                        Village names show inconsistent spelling conventions. e.g. "Barkharia" vs "Badkhadiya" vs "Barkhariya". AAS Group names fluctuate heavily (e.g., "Gaytri", "Gayatri AAS", "Gaytri group").
                      </p>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-500">
                        Recommendation: Implement soft-matching/fuzzy-string merge on import.
                      </div>
                    </div>
                  </div>

                  {/* Insight 4 */}
                  <div className="flex gap-4">
                    <div className="mt-1 bg-emerald-100 text-emerald-600 p-2 rounded-lg shrink-0 h-fit">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1">Extensive Consumption Data Intact</h4>
                      <p className="text-sm text-slate-600 mb-3">
                        The dataset captures extensive boolean arrays for specific crop consumption behavior (e.g., "What are green food did you consumed in january2022/bottle gourd"). This provides a highly dense foundation for nutritional-security outcome tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stories" && (
            <div className="max-w-6xl mx-auto pb-12">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">Qualitative Insights: Stories of Change</h3>
                <p className="text-slate-500 text-sm mt-1">Impact narratives detailing the journey of resilience, self-reliance, and empowerment among women farmers.</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  {/* Search */}
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search stories by name or title..."
                      value={storySearchQuery}
                      onChange={e => setStorySearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium placeholder:font-normal"
                    />
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                      <Tag size={12} /> Themes
                    </div>
                    {["All", "Turmeric Adoption", "Social Empowerment", "LEISA", "Economic Transformation", "Leadership", "Child Education", "Right to Entitlements"].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedStoryTag(tag)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${selectedStoryTag === tag ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories.filter(story => {
                  const matchesSearch = String(story.name || "").toLowerCase().includes(storySearchQuery.toLowerCase()) || String(story.title || "").toLowerCase().includes(storySearchQuery.toLowerCase());
                  const matchesTag = selectedStoryTag === "All" || (story.tags && story.tags.includes(selectedStoryTag));
                  return matchesSearch && matchesTag;
                }).map(story => {
                  const Icon = story.icon;
                  return (
                    <div key={story.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all hover:shadow-md">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${story.bg} ${story.color} border ${story.border}`}>
                          <Icon size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{story.name}</h4>
                          <p className="text-sm font-medium text-slate-500">{story.village}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {story.tags && story.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h5 className="text-md font-semibold text-slate-800 mb-2">{story.title}</h5>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                        {story.description}
                      </p>
                      <button
                        onClick={() => { setSelectedStory(story.id); setReadProgress(0); }}
                        className="text-teal-600 font-semibold text-sm flex items-center gap-2 w-max hover:text-teal-700 transition-colors group"
                      >
                        Read Full Case Study <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
