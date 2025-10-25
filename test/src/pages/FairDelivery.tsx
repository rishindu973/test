import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductItem {
  id: string;
  name: string;
  sentQuantity: number;
  price: number;
  returnedQuantity: number;
}

interface FairDeliveryRecord {
  id: string;
  fairName: string;
  driverName: string;
  products: ProductItem[];
  status: "out" | "return";
  tax: number;
  extraExpenses: number;
  dieselExpenses: number;
  profit: number;
}

const FairDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [deliveries, setDeliveries] = useState<FairDeliveryRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [fairName, setFairName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [status, setStatus] = useState<"out" | "return">("out");
  const [tax, setTax] = useState(0);
  const [extraExpenses, setExtraExpenses] = useState(0);
  const [dieselExpenses, setDieselExpenses] = useState(0);
  const [products, setProducts] = useState<ProductItem[]>([
    { id: "1", name: "", sentQuantity: 0, price: 0, returnedQuantity: 0 }
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now().toString(), name: "", sentQuantity: 0, price: 0, returnedQuantity: 0 }
    ]);
  };

  const updateProduct = (id: string, field: keyof ProductItem, value: string | number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const validateForm = () => {
    if (!fairName.trim()) {
      toast({
        title: "Error",
        description: "Please enter fair name",
        variant: "destructive",
      });
      return false;
    }
    
    if (!driverName.trim()) {
      toast({
        title: "Error",
        description: "Please enter driver name",
        variant: "destructive",
      });
      return false;
    }

    for (const product of products) {
      if (!product.name.trim()) {
        toast({
          title: "Error",
          description: "Please enter product name for all products",
          variant: "destructive",
        });
        return false;
      }
      if (product.sentQuantity < 0 || product.price < 0 || product.returnedQuantity < 0) {
        toast({
          title: "Error",
          description: "Quantity and price cannot be below 0",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const calculateProfit = () => {
    const sentTotal = products.reduce((sum, p) => sum + (p.sentQuantity * p.price), 0);
    const returnedTotal = products.reduce((sum, p) => sum + (p.returnedQuantity * p.price), 0);
    return sentTotal - (returnedTotal + tax + extraExpenses + dieselExpenses);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const profit = calculateProfit();

    if (editingId) {
      // Update existing delivery
      setDeliveries(deliveries.map(d => 
        d.id === editingId 
          ? { id: editingId, fairName, driverName, products, status, tax, extraExpenses, dieselExpenses, profit }
          : d
      ));
      toast({
        title: "Success",
        description: "Fair delivery updated successfully",
      });
      setEditingId(null);
    } else {
      // Add new delivery
      const newDelivery: FairDeliveryRecord = {
        id: Date.now().toString(),
        fairName,
        driverName,
        products,
        status,
        tax,
        extraExpenses,
        dieselExpenses,
        profit,
      };
      setDeliveries([...deliveries, newDelivery]);
      toast({
        title: "Success",
        description: "Fair delivery added successfully",
      });
    }

    // Reset form
    setFairName("");
    setDriverName("");
    setStatus("out");
    setTax(0);
    setExtraExpenses(0);
    setDieselExpenses(0);
    setProducts([{ id: "1", name: "", sentQuantity: 0, price: 0, returnedQuantity: 0 }]);
  };

  const handleEdit = (delivery: FairDeliveryRecord) => {
    setEditingId(delivery.id);
    setFairName(delivery.fairName);
    setDriverName(delivery.driverName);
    setStatus(delivery.status);
    setTax(delivery.tax);
    setExtraExpenses(delivery.extraExpenses);
    setDieselExpenses(delivery.dieselExpenses);
    setProducts(delivery.products);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setDeliveries(deliveries.filter(d => d.id !== id));
    toast({
      title: "Success",
      description: "Fair delivery deleted successfully",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFairName("");
    setDriverName("");
    setStatus("out");
    setTax(0);
    setExtraExpenses(0);
    setDieselExpenses(0);
    setProducts([{ id: "1", name: "", sentQuantity: 0, price: 0, returnedQuantity: 0 }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bakery-cream to-bakery-warm">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-bakery-brown">Fair Delivery Management</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Add/Edit Form Window */}
        <div className="flex justify-center mb-8">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{editingId ? "Update Fair Delivery" : "Add New Fair Delivery"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fair Name and Driver Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fairName">Fair Name</Label>
                  <Input
                    id="fairName"
                    value={fairName}
                    onChange={(e) => setFairName(e.target.value)}
                    placeholder="Enter fair name"
                  />
                </div>
                <div>
                  <Label htmlFor="driverName">Driver Name</Label>
                  <Input
                    id="driverName"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Enter driver name"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: "out" | "return") => setStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="out">Out</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Products</Label>
                  <Button onClick={addProduct} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Sent Qty</TableHead>
                        <TableHead>Price (Rs.)</TableHead>
                        <TableHead>Returned Qty</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Input
                              value={product.name}
                              onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                              placeholder="Product name"
                              className="h-9"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={product.sentQuantity}
                              onChange={(e) => updateProduct(product.id, "sentQuantity", Math.max(0, Number(e.target.value)))}
                              placeholder="0"
                              className="h-9"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={product.price}
                              onChange={(e) => updateProduct(product.id, "price", Math.max(0, Number(e.target.value)))}
                              placeholder="0"
                              className="h-9"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={product.returnedQuantity}
                              onChange={(e) => updateProduct(product.id, "returnedQuantity", Math.max(0, Number(e.target.value)))}
                              placeholder="0"
                              className="h-9"
                            />
                          </TableCell>
                          <TableCell>
                            {products.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Expenses */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tax">Tax (Rs.)</Label>
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    value={tax}
                    onChange={(e) => setTax(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="extraExpenses">Extra Expenses (Rs.)</Label>
                  <Input
                    id="extraExpenses"
                    type="number"
                    min="0"
                    value={extraExpenses}
                    onChange={(e) => setExtraExpenses(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="dieselExpenses">Diesel Expenses (Rs.)</Label>
                  <Input
                    id="dieselExpenses"
                    type="number"
                    min="0"
                    value={dieselExpenses}
                    onChange={(e) => setDieselExpenses(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                {editingId && (
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                <Button onClick={handleSave}>
                  {editingId ? "Update" : "Save"} Delivery
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Deliveries List */}
        {deliveries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-bakery-brown">Saved Deliveries</h2>
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-lg">{delivery.fairName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          delivery.status === "out" 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {delivery.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Driver: {delivery.driverName}</p>
                      
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">Products:</p>
                        {delivery.products.map((product) => (
                          <div key={product.id} className="pl-4 text-sm">
                            <p>
                              <span className="font-medium">{product.name}</span> - 
                              Sent: {product.sentQuantity}, 
                              Returned: {product.returnedQuantity}, 
                              Price: Rs. {product.price}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t space-y-1">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="text-muted-foreground">Tax:</p>
                          <p className="font-medium">Rs. {delivery.tax}</p>
                          <p className="text-muted-foreground">Extra Expenses:</p>
                          <p className="font-medium">Rs. {delivery.extraExpenses}</p>
                          <p className="text-muted-foreground">Diesel Expenses:</p>
                          <p className="font-medium">Rs. {delivery.dieselExpenses}</p>
                          <p className="text-muted-foreground font-semibold">Profit:</p>
                          <p className={`font-bold ${delivery.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Rs. {delivery.profit.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(delivery)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(delivery.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FairDelivery;