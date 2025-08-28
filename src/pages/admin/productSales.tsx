// import { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";
// import {
//   TrendingUp,
//   Package,
//   DollarSign,
//   Calendar,
//   Users,
//   BookOpen,
// } from "lucide-react";

const ProductSalesDashboard = () => {
  // const [selectedProduct, setSelectedProduct] = useState(
  //   "conversation-starter-6-12"
  // );
  // const [chartType, setChartType] = useState("line");

  // // Product data for conversation starter cards and story cards
  // const productsData = {
  //   "conversation-starter-6-12": {
  //     name: "Conversation Starter Cards (6-12)",
  //     category: "Conversation Starter",
  //     ageGroup: "6-12 years",
  //     color: "#FFFFFF",
  //     totalSold: 2847,
  //     revenue: "$85,410",
  //     data: [
  //       { month: "Jan", sales: 198, revenue: 5940 },
  //       { month: "Feb", sales: 234, revenue: 7020 },
  //       { month: "Mar", sales: 276, revenue: 8280 },
  //       { month: "Apr", sales: 289, revenue: 8670 },
  //       { month: "May", sales: 312, revenue: 9360 },
  //       { month: "Jun", sales: 267, revenue: 8010 },
  //       { month: "Jul", sales: 189, revenue: 5670 },
  //       { month: "Aug", sales: 245, revenue: 7350 },
  //       { month: "Sep", sales: 298, revenue: 8940 },
  //       { month: "Oct", sales: 256, revenue: 7680 },
  //       { month: "Nov", sales: 134, revenue: 4020 },
  //       { month: "Dec", sales: 149, revenue: 4470 },
  //     ],
  //   },
  //   "conversation-starter-13-16": {
  //     name: "Conversation Starter Cards (13-16)",
  //     category: "Conversation Starter",
  //     ageGroup: "13-16 years",
  //     color: "#FF9933",
  //     totalSold: 1934,
  //     revenue: "$58,020",
  //     data: [
  //       { month: "Jan", sales: 145, revenue: 4350 },
  //       { month: "Feb", sales: 167, revenue: 5010 },
  //       { month: "Mar", sales: 189, revenue: 5670 },
  //       { month: "Apr", sales: 201, revenue: 6030 },
  //       { month: "May", sales: 234, revenue: 7020 },
  //       { month: "Jun", sales: 198, revenue: 5940 },
  //       { month: "Jul", sales: 156, revenue: 4680 },
  //       { month: "Aug", sales: 178, revenue: 5340 },
  //       { month: "Sep", sales: 212, revenue: 6360 },
  //       { month: "Oct", sales: 167, revenue: 5010 },
  //       { month: "Nov", sales: 87, revenue: 2610 },
  //       { month: "Dec", sales: 100, revenue: 3000 },
  //     ],
  //   },
  //   "conversation-starter-17-19": {
  //     name: "Conversation Starter Cards (17-19)",
  //     category: "Conversation Starter",
  //     ageGroup: "17-19 years",
  //     color: "#FFCC00",
  //     totalSold: 1456,
  //     revenue: "$43,680",
  //     data: [
  //       { month: "Jan", sales: 112, revenue: 3360 },
  //       { month: "Feb", sales: 134, revenue: 4020 },
  //       { month: "Mar", sales: 145, revenue: 4350 },
  //       { month: "Apr", sales: 156, revenue: 4680 },
  //       { month: "May", sales: 178, revenue: 5340 },
  //       { month: "Jun", sales: 167, revenue: 5010 },
  //       { month: "Jul", sales: 123, revenue: 3690 },
  //       { month: "Aug", sales: 134, revenue: 4020 },
  //       { month: "Sep", sales: 149, revenue: 4470 },
  //       { month: "Oct", sales: 120, revenue: 3600 },
  //       { month: "Nov", sales: 67, revenue: 2010 },
  //       { month: "Dec", sales: 71, revenue: 2130 },
  //     ],
  //   },
  //   "conversation-starter-20-plus": {
  //     name: "Conversation Starter Cards (20+)",
  //     category: "Conversation Starter",
  //     ageGroup: "20+ years",
  //     color: "#FF6600",
  //     totalSold: 3214,
  //     revenue: "$96,420",
  //     data: [
  //       { month: "Jan", sales: 234, revenue: 7020 },
  //       { month: "Feb", sales: 278, revenue: 8340 },
  //       { month: "Mar", sales: 301, revenue: 9030 },
  //       { month: "Apr", sales: 289, revenue: 8670 },
  //       { month: "May", sales: 345, revenue: 10350 },
  //       { month: "Jun", sales: 312, revenue: 9360 },
  //       { month: "Jul", sales: 267, revenue: 8010 },
  //       { month: "Aug", sales: 298, revenue: 8940 },
  //       { month: "Sep", sales: 334, revenue: 10020 },
  //       { month: "Oct", sales: 289, revenue: 8670 },
  //       { month: "Nov", sales: 167, revenue: 5010 },
  //       { month: "Dec", sales: 200, revenue: 6000 },
  //     ],
  //   },
  //   "silent-stories-6-12": {
  //     name: "Silent Stories (6-12)",
  //     category: "Silent Stories",
  //     ageGroup: "6-12 years",
  //     color: "#FFFFFF",
  //     totalSold: 1823,
  //     revenue: "$63,805",
  //     data: [
  //       { month: "Jan", sales: 134, revenue: 4690 },
  //       { month: "Feb", sales: 156, revenue: 5460 },
  //       { month: "Mar", sales: 178, revenue: 6230 },
  //       { month: "Apr", sales: 167, revenue: 5845 },
  //       { month: "May", sales: 189, revenue: 6615 },
  //       { month: "Jun", sales: 201, revenue: 7035 },
  //       { month: "Jul", sales: 145, revenue: 5075 },
  //       { month: "Aug", sales: 167, revenue: 5845 },
  //       { month: "Sep", sales: 178, revenue: 6230 },
  //       { month: "Oct", sales: 156, revenue: 5460 },
  //       { month: "Nov", sales: 87, revenue: 3045 },
  //       { month: "Dec", sales: 105, revenue: 3675 },
  //     ],
  //   },
  //   "silent-stories-13-16": {
  //     name: "Silent Stories (13-16)",
  //     category: "Silent Stories",
  //     ageGroup: "13-16 years",
  //     color: "#FF9933",
  //     totalSold: 1245,
  //     revenue: "$43,575",
  //     data: [
  //       { month: "Jan", sales: 98, revenue: 3430 },
  //       { month: "Feb", sales: 112, revenue: 3920 },
  //       { month: "Mar", sales: 123, revenue: 4305 },
  //       { month: "Apr", sales: 134, revenue: 4690 },
  //       { month: "May", sales: 145, revenue: 5075 },
  //       { month: "Jun", sales: 156, revenue: 5460 },
  //       { month: "Jul", sales: 109, revenue: 3815 },
  //       { month: "Aug", sales: 118, revenue: 4130 },
  //       { month: "Sep", sales: 127, revenue: 4445 },
  //       { month: "Oct", sales: 103, revenue: 3605 },
  //       { month: "Nov", sales: 67, revenue: 2345 },
  //       { month: "Dec", sales: 53, revenue: 1855 },
  //     ],
  //   },
  //   "silent-stories-17-19": {
  //     name: "Silent Stories (17-19)",
  //     category: "Silent Stories",
  //     ageGroup: "17-19 years",
  //     color: "#FFCC00",
  //     totalSold: 987,
  //     revenue: "$34,545",
  //     data: [
  //       { month: "Jan", sales: 76, revenue: 2660 },
  //       { month: "Feb", sales: 89, revenue: 3115 },
  //       { month: "Mar", sales: 94, revenue: 3290 },
  //       { month: "Apr", sales: 102, revenue: 3570 },
  //       { month: "May", sales: 109, revenue: 3815 },
  //       { month: "Jun", sales: 98, revenue: 3430 },
  //       { month: "Jul", sales: 82, revenue: 2870 },
  //       { month: "Aug", sales: 87, revenue: 3045 },
  //       { month: "Sep", sales: 91, revenue: 3185 },
  //       { month: "Oct", sales: 78, revenue: 2730 },
  //       { month: "Nov", sales: 45, revenue: 1575 },
  //       { month: "Dec", sales: 36, revenue: 1260 },
  //     ],
  //   },
  //   "silent-stories-20-plus": {
  //     name: "Silent Stories (20+)",
  //     category: "Silent Stories",
  //     ageGroup: "20+ years",
  //     color: "#FF6600",
  //     totalSold: 1567,
  //     revenue: "$54,845",
  //     data: [
  //       { month: "Jan", sales: 123, revenue: 4305 },
  //       { month: "Feb", sales: 134, revenue: 4690 },
  //       { month: "Mar", sales: 145, revenue: 5075 },
  //       { month: "Apr", sales: 156, revenue: 5460 },
  //       { month: "May", sales: 167, revenue: 5845 },
  //       { month: "Jun", sales: 178, revenue: 6230 },
  //       { month: "Jul", sales: 134, revenue: 4690 },
  //       { month: "Aug", sales: 145, revenue: 5075 },
  //       { month: "Sep", sales: 156, revenue: 5460 },
  //       { month: "Oct", sales: 134, revenue: 4690 },
  //       { month: "Nov", sales: 76, revenue: 2660 },
  //       { month: "Dec", sales: 59, revenue: 2065 },
  //     ],
  //   },
  //   "story-reteller-6-12": {
  //     name: "Story-Reteller Cards (6-12)",
  //     category: "Story-Reteller",
  //     ageGroup: "6-12 years",
  //     color: "#FFFFFF",
  //     totalSold: 2134,
  //     revenue: "$85,360",
  //     data: [
  //       { month: "Jan", sales: 167, revenue: 6680 },
  //       { month: "Feb", sales: 189, revenue: 7560 },
  //       { month: "Mar", sales: 201, revenue: 8040 },
  //       { month: "Apr", sales: 234, revenue: 9360 },
  //       { month: "May", sales: 245, revenue: 9800 },
  //       { month: "Jun", sales: 212, revenue: 8480 },
  //       { month: "Jul", sales: 178, revenue: 7120 },
  //       { month: "Aug", sales: 189, revenue: 7560 },
  //       { month: "Sep", sales: 201, revenue: 8040 },
  //       { month: "Oct", sales: 189, revenue: 7560 },
  //       { month: "Nov", sales: 89, revenue: 3560 },
  //       { month: "Dec", sales: 140, revenue: 5600 },
  //     ],
  //   },
  //   "story-reteller-13-16": {
  //     name: "Story-Reteller Cards (13-16)",
  //     category: "Story-Reteller",
  //     ageGroup: "13-16 years",
  //     color: "#FF9933",
  //     totalSold: 1456,
  //     revenue: "$58,240",
  //     data: [
  //       { month: "Jan", sales: 112, revenue: 4480 },
  //       { month: "Feb", sales: 134, revenue: 5360 },
  //       { month: "Mar", sales: 145, revenue: 5800 },
  //       { month: "Apr", sales: 156, revenue: 6240 },
  //       { month: "May", sales: 167, revenue: 6680 },
  //       { month: "Jun", sales: 178, revenue: 7120 },
  //       { month: "Jul", sales: 134, revenue: 5360 },
  //       { month: "Aug", sales: 123, revenue: 4920 },
  //       { month: "Sep", sales: 134, revenue: 5360 },
  //       { month: "Oct", sales: 112, revenue: 4480 },
  //       { month: "Nov", sales: 67, revenue: 2680 },
  //       { month: "Dec", sales: 94, revenue: 3760 },
  //     ],
  //   },
  //   "story-reteller-17-19": {
  //     name: "Story-Reteller Cards (17-19)",
  //     category: "Story-Reteller",
  //     ageGroup: "17-19 years",
  //     color: "#FFCC00",
  //     totalSold: 1087,
  //     revenue: "$43,480",
  //     data: [
  //       { month: "Jan", sales: 87, revenue: 3480 },
  //       { month: "Feb", sales: 98, revenue: 3920 },
  //       { month: "Mar", sales: 109, revenue: 4360 },
  //       { month: "Apr", sales: 112, revenue: 4480 },
  //       { month: "May", sales: 123, revenue: 4920 },
  //       { month: "Jun", sales: 134, revenue: 5360 },
  //       { month: "Jul", sales: 103, revenue: 4120 },
  //       { month: "Aug", sales: 89, revenue: 3560 },
  //       { month: "Sep", sales: 94, revenue: 3760 },
  //       { month: "Oct", sales: 87, revenue: 3480 },
  //       { month: "Nov", sales: 34, revenue: 1360 },
  //       { month: "Dec", sales: 17, revenue: 680 },
  //     ],
  //   },
  //   "story-reteller-20-plus": {
  //     name: "Story-Reteller Cards (20+)",
  //     category: "Story-Reteller",
  //     ageGroup: "20+ years",
  //     color: "#FF6600",
  //     totalSold: 1789,
  //     revenue: "$71,560",
  //     data: [
  //       { month: "Jan", sales: 134, revenue: 5360 },
  //       { month: "Feb", sales: 145, revenue: 5800 },
  //       { month: "Mar", sales: 167, revenue: 6680 },
  //       { month: "Apr", sales: 178, revenue: 7120 },
  //       { month: "May", sales: 189, revenue: 7560 },
  //       { month: "Jun", sales: 201, revenue: 8040 },
  //       { month: "Jul", sales: 156, revenue: 6240 },
  //       { month: "Aug", sales: 145, revenue: 5800 },
  //       { month: "Sep", sales: 167, revenue: 6680 },
  //       { month: "Oct", sales: 134, revenue: 5360 },
  //       { month: "Nov", sales: 87, revenue: 3480 },
  //       { month: "Dec", sales: 86, revenue: 3440 },
  //     ],
  //   },
  //   "conversation-story-card-20-plus": {
  //     name: "Conversation Story Card (20+)",
  //     category: "Conversation Story Card",
  //     ageGroup: "20+ years",
  //     color: "#FF6600",
  //     totalSold: 2567,
  //     revenue: "$102,680",
  //     data: [
  //       { month: "Jan", sales: 198, revenue: 7920 },
  //       { month: "Feb", sales: 234, revenue: 9360 },
  //       { month: "Mar", sales: 267, revenue: 10680 },
  //       { month: "Apr", sales: 289, revenue: 11560 },
  //       { month: "May", sales: 312, revenue: 12480 },
  //       { month: "Jun", sales: 278, revenue: 11120 },
  //       { month: "Jul", sales: 234, revenue: 9360 },
  //       { month: "Aug", sales: 245, revenue: 9800 },
  //       { month: "Sep", sales: 256, revenue: 10240 },
  //       { month: "Oct", sales: 223, revenue: 8920 },
  //       { month: "Nov", sales: 156, revenue: 6240 },
  //       { month: "Dec", sales: 175, revenue: 7000 },
  //     ],
  //   },
  // };

  // const currentProduct = productsData[selectedProduct];

  // // Group products by category for better organization
  // const productsByCategory = {
  //   "Conversation Starter": Object.entries(productsData).filter(
  //     ([_, product]) => product.category === "Conversation Starter"
  //   ),
  //   "Silent Stories": Object.entries(productsData).filter(
  //     ([_, product]) => product.category === "Silent Stories"
  //   ),
  //   "Story-Reteller": Object.entries(productsData).filter(
  //     ([_, product]) => product.category === "Story-Reteller"
  //   ),
  //   "Conversation Story Card": Object.entries(productsData).filter(
  //     ([_, product]) => product.category === "Conversation Story Card"
  //   ),
  // };

  return (
    <></>
    // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6">
    //   <div className="max-w-7xl mx-auto">
    //     {/* Header */}
    //     <div className="text-center mb-8">
    //       <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
    //         Card Products Sales Analytics
    //       </h1>
    //       <p className="text-slate-300">
    //         Track your conversation starter and story cards performance across
    //         all age groups
    //       </p>
    //     </div>

    //     {/* Category-wise Product Selection */}
    //     <div className="mb-8 space-y-6">
    //       {Object.entries(productsByCategory).map(([category, products]) => (
    //         <div
    //           key={category}
    //           className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    //         >
    //           <h3 className="text-xl font-bold text-white mb-4 flex items-center">
    //             {category === "Conversation Starter" && (
    //               <Users className="w-5 h-5 mr-2" />
    //             )}
    //             {category === "Silent Stories" && (
    //               <BookOpen className="w-5 h-5 mr-2" />
    //             )}
    //             {category === "Story-Reteller" && (
    //               <Package className="w-5 h-5 mr-2" />
    //             )}
    //             {category === "Conversation Story Card" && (
    //               <BookOpen className="w-5 h-5 mr-2" />
    //             )}
    //             {category}
    //           </h3>
    //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
    //             {products.map(([key, product]) => (
    //               <button
    //                 key={key}
    //                 onClick={() => setSelectedProduct(key)}
    //                 className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-sm ${
    //                   selectedProduct === key
    //                     ? "bg-white text-slate-900 shadow-lg shadow-white/25"
    //                     : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
    //                 }`}
    //                 style={{
    //                   backgroundColor:
    //                     selectedProduct === key ? product.color : undefined,
    //                   color:
    //                     selectedProduct === key && product.color === "#FFFFFF"
    //                       ? "#1e293b"
    //                       : selectedProduct === key
    //                       ? "#1e293b"
    //                       : undefined,
    //                 }}
    //               >
    //                 <div className="text-xs opacity-75 mb-1">
    //                   {product.ageGroup}
    //                 </div>
    //                 <div>{product.name.split("(")[0].trim()}</div>
    //               </button>
    //             ))}
    //           </div>
    //         </div>
    //       ))}
    //     </div>

    //     {/* Stats Cards */}
    //     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    //       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-slate-300 text-sm font-medium">
    //               Total Cards Sold
    //             </p>
    //             <p className="text-3xl font-bold text-white mt-1">
    //               {currentProduct.totalSold.toLocaleString()}
    //             </p>
    //           </div>
    //           <div className="bg-orange-500/20 p-3 rounded-xl">
    //             <TrendingUp className="w-8 h-8 text-orange-400" />
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-slate-300 text-sm font-medium">
    //               Total Revenue
    //             </p>
    //             <p className="text-3xl font-bold text-white mt-1">
    //               {currentProduct.revenue}
    //             </p>
    //           </div>
    //           <div className="bg-yellow-500/20 p-3 rounded-xl">
    //             <DollarSign className="w-8 h-8 text-yellow-400" />
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-slate-300 text-sm font-medium">Age Group</p>
    //             <p className="text-2xl font-bold text-white mt-1">
    //               {currentProduct.ageGroup}
    //             </p>
    //           </div>
    //           <div className="bg-white/20 p-3 rounded-xl">
    //             <Users className="w-8 h-8 text-white" />
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <p className="text-slate-300 text-sm font-medium">
    //               Avg Monthly Sales
    //             </p>
    //             <p className="text-3xl font-bold text-white mt-1">
    //               {Math.round(currentProduct.totalSold / 12).toLocaleString()}
    //             </p>
    //           </div>
    //           <div className="bg-orange-500/20 p-3 rounded-xl">
    //             <Calendar className="w-8 h-8 text-orange-400" />
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Chart Controls */}
    //     <div className="flex justify-center mb-6">
    //       <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
    //         <button
    //           onClick={() => setChartType("line")}
    //           className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
    //             chartType === "line"
    //               ? "bg-orange-400 text-slate-900"
    //               : "text-white hover:bg-white/10"
    //           }`}
    //         >
    //           Line Chart
    //         </button>
    //         <button
    //           onClick={() => setChartType("bar")}
    //           className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
    //             chartType === "bar"
    //               ? "bg-orange-400 text-slate-900"
    //               : "text-white hover:bg-white/10"
    //           }`}
    //         >
    //           Bar Chart
    //         </button>
    //       </div>
    //     </div>

    //     {/* Chart Container */}
    //     <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
    //       <div className="mb-6">
    //         <h3 className="text-2xl font-bold text-white mb-2">
    //           {currentProduct.name} - Sales Performance
    //         </h3>
    //         <div className="flex items-center space-x-4 text-slate-300">
    //           <span>Category: {currentProduct.category}</span>
    //           <span>•</span>
    //           <span>Age Group: {currentProduct.ageGroup}</span>
    //           <div
    //             className="w-4 h-4 rounded-full ml-2"
    //             style={{ backgroundColor: currentProduct.color }}
    //           ></div>
    //         </div>
    //       </div>

    //       <div style={{ height: "400px" }}>
    //         <ResponsiveContainer width="100%" height="100%">
    //           {chartType === "line" ? (
    //             <LineChart data={currentProduct.data}>
    //               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    //               <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
    //               <YAxis stroke="#94A3B8" fontSize={12} />
    //               <Tooltip
    //                 contentStyle={{
    //                   backgroundColor: "rgba(15, 23, 42, 0.9)",
    //                   border: "1px solid rgba(255, 255, 255, 0.2)",
    //                   borderRadius: "8px",
    //                   color: "#fff",
    //                 }}
    //                 formatter={(value, name) => [
    //                   name === "sales"
    //                     ? `${value} cards`
    //                     : `$${value.toLocaleString()}`,
    //                   name === "sales" ? "Cards Sold" : "Revenue",
    //                 ]}
    //               />
    //               <Line
    //                 type="monotone"
    //                 dataKey="sales"
    //                 stroke={
    //                   currentProduct.color === "#FFFFFF"
    //                     ? "#F97316"
    //                     : currentProduct.color
    //                 }
    //                 strokeWidth={3}
    //                 dot={{
    //                   fill:
    //                     currentProduct.color === "#FFFFFF"
    //                       ? "#F97316"
    //                       : currentProduct.color,
    //                   strokeWidth: 2,
    //                   r: 5,
    //                 }}
    //                 activeDot={{
    //                   r: 7,
    //                   stroke:
    //                     currentProduct.color === "#FFFFFF"
    //                       ? "#F97316"
    //                       : currentProduct.color,
    //                   strokeWidth: 2,
    //                 }}
    //               />
    //             </LineChart>
    //           ) : (
    //             <BarChart data={currentProduct.data}>
    //               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    //               <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
    //               <YAxis stroke="#94A3B8" fontSize={12} />
    //               <Tooltip
    //                 contentStyle={{
    //                   backgroundColor: "rgba(15, 23, 42, 0.9)",
    //                   border: "1px solid rgba(255, 255, 255, 0.2)",
    //                   borderRadius: "8px",
    //                   color: "#fff",
    //                 }}
    //                 formatter={(value) => [`${value} cards`, "Cards Sold"]}
    //               />
    //               <Bar
    //                 dataKey="sales"
    //                 fill={
    //                   currentProduct.color === "#FFFFFF"
    //                     ? "#F97316"
    //                     : currentProduct.color
    //                 }
    //                 radius={[4, 4, 0, 0]}
    //               />
    //             </BarChart>
    //           )}
    //         </ResponsiveContainer>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ProductSalesDashboard;
