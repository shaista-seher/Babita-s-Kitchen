import { useState } from "react";
import { useLocation as useWouterLocation } from "wouter";
import { format } from "date-fns";
import { Layout } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import { useOrders, useAddresses, useCreateAddress } from "@/hooks/use-supabase";
import { useLocation, UserLocation } from "@/context/location-context";
import { Clock, Edit3, Loader2, MapPin, Package, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: loadingOrders } = useOrders(user?.id || "");
  const { data: addresses } = useAddresses(user?.id || "");
  const createAddress = useCreateAddress();
  const { location } = useLocation() as {
    location: UserLocation | null;
  };
  const [, setLocation] = useWouterLocation();

  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  if (!isAuthenticated || authLoading) {
    return (
      <Layout>
        <div className="flex flex-1 flex-col items-center justify-center py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createAddress.mutate(
      {
        userId: user.id,
        label: newAddress.label,
        address: newAddress.address,
        latitude: location?.latitude,
        longitude: location?.longitude,
        isDefault: (addresses?.length || 0) === 0,
      },
      {
        onSuccess: () => {
          setIsAddressOpen(false);
          setNewAddress({ label: "", address: "" });
        },
      }
    );
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user_name", `${profileData.firstName} ${profileData.lastName}`.trim());
    localStorage.setItem("user_phone", profileData.phone);
    setIsProfileEditOpen(false);
    setLocation("/profile");
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-secondary/10 text-secondary";
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row">
          <div className="w-full shrink-0 space-y-2 md:w-64">
            <div className="mb-6 rounded-3xl border border-border/50 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-bold text-primary">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <h2 className="font-display text-lg font-semibold">{user?.firstName || "User"}</h2>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full rounded-2xl px-5 py-4 text-left font-medium transition-all ${
                activeTab === "orders" ? "bg-secondary text-white shadow-md" : "text-secondary hover:bg-secondary/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <Package className="h-5 w-5" /> Order History
              </span>
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full rounded-2xl px-5 py-4 text-left font-medium transition-all ${
                activeTab === "addresses" ? "bg-secondary text-white shadow-md" : "text-secondary hover:bg-secondary/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <MapPin className="h-5 w-5" /> Saved Addresses
              </span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full rounded-2xl px-5 py-4 text-left font-medium transition-all ${
                activeTab === "profile" ? "bg-secondary text-white shadow-md" : "text-secondary hover:bg-secondary/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <Edit3 className="h-5 w-5" /> Edit Profile
              </span>
            </button>
          </div>

          <div className="flex-1">
            {activeTab === "profile" ? (
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="font-display text-3xl font-bold text-foreground">Edit Profile</h3>
                  <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
                    <DialogTrigger asChild>
                      <Button className="rounded-full bg-primary hover:bg-primary/90">
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-[2rem] p-8">
                      <DialogHeader>
                        <DialogTitle className="mb-4 font-display text-2xl">Edit Profile Information</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateProfile} className="space-y-5">
                        <div>
                          <label className="mb-2 block text-sm font-medium">First Name</label>
                          <Input
                            required
                            value={profileData.firstName}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                            className="rounded-xl"
                            placeholder="First Name"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">Last Name</label>
                          <Input
                            value={profileData.lastName}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                            className="rounded-xl"
                            placeholder="Last Name"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">Phone Number</label>
                          <Input
                            required
                            value={profileData.phone}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                            className="rounded-xl"
                            placeholder="Phone Number"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                            className="rounded-xl"
                            placeholder="Email"
                          />
                        </div>
                        <Button type="submit" className="h-12 w-full rounded-xl bg-secondary text-white">
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-3xl border border-border/50 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-bold text-primary">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-gray-800">
                        {user?.firstName || "User"} {user?.lastName || ""}
                      </h4>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <p className="text-sm text-gray-600">{user?.phone ? `+91 ${user.phone}` : "No phone"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "orders" ? (
              <div>
                <h3 className="mb-8 font-display text-3xl font-bold text-foreground">Order History</h3>
                {loadingOrders ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-3xl border border-border/50 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
                      >
                        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-border/50 pb-6 sm:flex-row">
                          <div>
                            <div className="mb-1 text-sm text-muted-foreground">Order #{order.id}</div>
                            <div className="flex items-center gap-2 font-medium text-foreground">
                              <Clock className="h-4 w-4 text-primary" />
                              {order.createdAt ? format(new Date(order.createdAt), "MMM dd, yyyy • h:mm a") : "Unknown date"}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-display text-xl font-bold text-foreground">
                              ${Number(order.totalAmount).toFixed(2)}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}
                            >
                              {order.status?.replace("_", " ")}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3 text-secondary">
                                <span className="w-6 font-medium">{item.quantity}x</span>
                                <span>{item.product.name}</span>
                              </div>
                              <span className="text-muted-foreground">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex items-start gap-2 border-t border-border/30 pt-4 text-sm text-muted-foreground">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-border/50 bg-white p-12 text-center">
                    <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="mb-2 text-lg font-medium text-foreground">No orders yet</p>
                    <p className="text-muted-foreground">When you place orders, they will appear here.</p>
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === "addresses" ? (
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="font-display text-3xl font-bold text-foreground">Saved Addresses</h3>
                  <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
                    <DialogTrigger asChild>
                      <Button className="rounded-full bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" /> Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-[2rem] p-8">
                      <DialogHeader>
                        <DialogTitle className="mb-4 font-display text-2xl">Add New Address</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddAddress} className="space-y-5">
                        <div>
                          <label className="mb-2 block text-sm font-medium">Label (e.g., Home, Work)</label>
                          <Input
                            required
                            value={newAddress.label}
                            onChange={(e) => setNewAddress((prev) => ({ ...prev, label: e.target.value }))}
                            className="rounded-xl"
                            placeholder="Home"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">Full Address</label>
                          <Textarea
                            required
                            value={newAddress.address}
                            onChange={(e) => setNewAddress((prev) => ({ ...prev, address: e.target.value }))}
                            className="resize-none rounded-xl"
                            rows={4}
                            placeholder="123 Organic St, Apt 4B..."
                          />
                        </div>
                        <Button type="submit" disabled={createAddress.isPending} className="h-12 w-full rounded-xl bg-secondary text-white">
                          {createAddress.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Address"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {addresses && addresses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {addresses.map((addr: any) => (
                      <div key={addr.id} className="relative rounded-3xl border border-border/50 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{addr.label}</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">{addr.full_address || addr.address}</p>
                        {addr.is_default ? (
                          <span className="absolute right-6 top-6 rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                            Default
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-border/50 bg-white p-12 text-center">
                    <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="mb-2 text-lg font-medium text-foreground">No addresses saved</p>
                    <p className="text-muted-foreground">Add an address to make checkout faster.</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
