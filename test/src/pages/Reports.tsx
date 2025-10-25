import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Calendar, FileText, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Reports = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Mock data - In real app, this would come from the backend
  const dailyReports = [
    {
      date: "2024-01-15",
      fairDeliveries: { count: 2, profit: 15000 },
      shopDeliveries: { count: 5, revenue: 25000 },
      totalProfit: 15000,
      totalRevenue: 25000,
    },
    {
      date: "2024-01-14",
      fairDeliveries: { count: 1, profit: 8000 },
      shopDeliveries: { count: 3, revenue: 18000 },
      totalProfit: 8000,
      totalRevenue: 18000,
    },
  ];

  const monthlyData = [
    {
      month: "January 2024",
      fairTotal: { deliveries: 45, profit: 350000 },
      shopTotal: { deliveries: 120, revenue: 580000 },
      totalProfit: 350000,
      totalRevenue: 580000,
    },
    {
      month: "December 2023",
      fairTotal: { deliveries: 42, profit: 320000 },
      shopTotal: { deliveries: 110, revenue: 520000 },
      totalProfit: 320000,
      totalRevenue: 520000,
    },
  ];

  const topShops = [
    { name: "Green Valley Shop", owner: "Mr. Silva", revenue: 45000, orders: 15 },
    { name: "City Mart", owner: "Mrs. Perera", revenue: 38000, orders: 12 },
    { name: "Corner Store", owner: "Mr. Fernando", revenue: 32000, orders: 10 },
  ];

  const topFairs = [
    { name: "Colombo Fair", profit: 85000, deliveries: 12 },
    { name: "Kandy Fair", profit: 72000, deliveries: 10 },
    { name: "Galle Fair", profit: 65000, deliveries: 8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bakery-cream to-bakery-warm">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-bakery-brown">Business Reports</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">This Month</SelectItem>
                <SelectItem value="last">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">Rs. 580,000</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fair Profits</p>
                  <p className="text-2xl font-bold text-accent">Rs. 350,000</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shop Revenue</p>
                  <p className="text-2xl font-bold text-bakery-gold">Rs. 580,000</p>
                </div>
                <FileText className="h-8 w-8 text-bakery-gold opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="text-2xl font-bold text-bakery-brown">165</p>
                </div>
                <Calendar className="h-8 w-8 text-bakery-brown opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="daily">Daily Reports</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyReports.map((report) => (
                    <div key={report.date} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{new Date(report.date).toLocaleDateString()}</h3>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Profit</p>
                          <p className="font-bold text-primary">Rs. {report.totalProfit.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-primary/5 p-3 rounded">
                          <p className="text-sm font-medium">Fair Deliveries</p>
                          <p className="text-lg">{report.fairDeliveries.count} deliveries</p>
                          <p className="text-sm text-primary">Profit: Rs. {report.fairDeliveries.profit.toLocaleString()}</p>
                        </div>
                        <div className="bg-accent/5 p-3 rounded">
                          <p className="text-sm font-medium">Shop Deliveries</p>
                          <p className="text-lg">{report.shopDeliveries.count} deliveries</p>
                          <p className="text-sm text-accent">Revenue: Rs. {report.shopDeliveries.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((month) => (
                      <div key={month.month} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">{month.month}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Fair Deliveries:</span>
                            <span className="font-medium">{month.fairTotal.deliveries}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Fair Profit:</span>
                            <span className="font-medium text-primary">Rs. {month.fairTotal.profit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Shop Deliveries:</span>
                            <span className="font-medium">{month.shopTotal.deliveries}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Shop Revenue:</span>
                            <span className="font-medium text-accent">Rs. {month.shopTotal.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Shops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topShops.map((shop, index) => (
                        <div key={shop.name} className="flex items-center justify-between p-3 bg-muted/20 rounded">
                          <div>
                            <p className="font-medium">{shop.name}</p>
                            <p className="text-sm text-muted-foreground">{shop.owner}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-accent">Rs. {shop.revenue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{shop.orders} orders</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Fairs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topFairs.map((fair, index) => (
                        <div key={fair.name} className="flex items-center justify-between p-3 bg-muted/20 rounded">
                          <div>
                            <p className="font-medium">{fair.name}</p>
                            <p className="text-sm text-muted-foreground">{fair.deliveries} deliveries</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">Rs. {fair.profit.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">profit</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;