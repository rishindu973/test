import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
}

interface Shop {
  id: string;
  name: string;
  owner: string;
  mobile: string;
  items: DeliveryItem[];
}

const ShopDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);

  const addShop = () => {
    const newShop: Shop = {
      id: Date.now().toString(),
      name: "",
      owner: "",
      mobile: "",
      items: [],
    };
    setShops([...shops, newShop]);
  };

  const updateShop = (shopId: string, field: keyof Omit<Shop, 'items'>, value: string) => {
    setShops(shops.map(shop => 
      shop.id === shopId ? { ...shop, [field]: value } : shop
    ));
  };

  const removeShop = (shopId: string) => {
    setShops(shops.filter(shop => shop.id !== shopId));
  };

  const addItemToShop = (shopId: string) => {
    const newItem: DeliveryItem = {
      id: Date.now().toString(),
      product: "",
      quantity: 0,
      price: 0,
    };
    
    setShops(shops.map(shop => 
      shop.id === shopId 
        ? { ...shop, items: [...shop.items, newItem] }
        : shop
    ));
  };

  const updateShopItem = (shopId: string, itemId: string, field: keyof DeliveryItem, value: any) => {
    setShops(shops.map(shop => 
      shop.id === shopId 
        ? {
            ...shop,
            items: shop.items.map(item => 
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : shop
    ));
  };

  const removeItemFromShop = (shopId: string, itemId: string) => {
    setShops(shops.map(shop => 
      shop.id === shopId 
        ? { ...shop, items: shop.items.filter(item => item.id !== itemId) }
        : shop
    ));
  };

  const calculateShopTotal = (shop: Shop) => {
    return shop.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateGrandTotal = () => {
    return shops.reduce((sum, shop) => sum + calculateShopTotal(shop), 0);
  };

  const handleSave = () => {
    if (!vehicleNumber || !driverName || shops.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in vehicle details and add at least one shop",
        variant: "destructive",
      });
      return;
    }

    const hasIncompleteShop = shops.some(shop => 
      !shop.name || !shop.owner || !shop.mobile || shop.items.length === 0
    );

    if (hasIncompleteShop) {
      toast({
        title: "Error",
        description: "Please complete all shop details and add items",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Shop delivery record saved successfully",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bakery-cream to-bakery-warm">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-bakery-brown">Shop Delivery Management</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Grand Total</p>
            <p className="text-xl font-bold text-primary">Rs. {calculateGrandTotal().toFixed(2)}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Vehicle Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vehicle & Driver Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle">Vehicle Number</Label>
              <Input
                id="vehicle"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="Enter vehicle number"
              />
            </div>
            <div>
              <Label htmlFor="driver">Driver Name</Label>
              <Input
                id="driver"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Enter driver name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Shops Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Shops & Deliveries</span>
            </CardTitle>
            <Button onClick={addShop} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Shop</span>
            </Button>
          </CardHeader>
          <CardContent>
            {shops.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No shops added yet. Click "Add Shop" to start.</p>
            ) : (
              <div className="space-y-6">
                {shops.map((shop, shopIndex) => (
                  <div key={shop.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Shop #{shopIndex + 1}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Total: Rs. {calculateShopTotal(shop).toFixed(2)}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeShop(shop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Shop Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label>Shop Name</Label>
                        <Input
                          value={shop.name}
                          onChange={(e) => updateShop(shop.id, "name", e.target.value)}
                          placeholder="Shop name"
                        />
                      </div>
                      <div>
                        <Label>Owner Name</Label>
                        <Input
                          value={shop.owner}
                          onChange={(e) => updateShop(shop.id, "owner", e.target.value)}
                          placeholder="Owner name"
                        />
                      </div>
                      <div>
                        <Label>Mobile Number</Label>
                        <Input
                          value={shop.mobile}
                          onChange={(e) => updateShop(shop.id, "mobile", e.target.value)}
                          placeholder="Mobile number"
                        />
                      </div>
                    </div>

                    {/* Shop Items */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Products Delivered</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addItemToShop(shop.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Product
                        </Button>
                      </div>
                      
                      {shop.items.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded">
                          No products added
                        </p>
                      ) : (
                         <div className="space-y-2">
                           {shop.items.map((item) => (
                             <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 bg-muted/10 rounded">
                               <div>
                                 <Input
                                   value={item.product}
                                   onChange={(e) => updateShopItem(shop.id, item.id, "product", e.target.value)}
                                   placeholder="Product name"
                                 />
                               </div>
                               <div>
                                 <Input
                                   type="number"
                                   value={item.quantity}
                                   onChange={(e) => updateShopItem(shop.id, item.id, "quantity", Number(e.target.value) || 0)}
                                   placeholder="Qty"
                                 />
                               </div>
                               <div>
                                 <Input
                                   type="number"
                                   value={item.price}
                                   onChange={(e) => updateShopItem(shop.id, item.id, "price", Number(e.target.value) || 0)}
                                   placeholder="Price"
                                 />
                               </div>
                               <div>
                                 <Input
                                   value={`Rs. ${(item.quantity * item.price).toFixed(2)}`}
                                   disabled
                                   className="bg-muted text-center"
                                 />
                               </div>
                               <div>
                                 <Button
                                   variant="destructive"
                                   size="sm"
                                   onClick={() => removeItemFromShop(shop.id, item.id)}
                                   className="w-full"
                                 >
                                   <Trash2 className="h-3 w-3" />
                                 </Button>
                               </div>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
            Save Delivery Record
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ShopDelivery;