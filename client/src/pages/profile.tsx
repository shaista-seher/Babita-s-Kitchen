import { useState } from "react";
import { useLocation as useWouterLocation } from "wouter";
import { Layout } from "@/components/layout";
import { useAuth } from "@/context/auth-context";
import { useOrders, useAddresses, useCreateAddress } from "@/hooks/use-supabase";
import { useLocation, UserLocation } from "@/context/location-context";
import { Clock, MapPin, Package, Plus, Loader2, Navigation, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const { data: orders, isLoading: loadingOrders } = useOrders(user?.id || "");
  const { data: addresses, isLoading: loadingAddresses } = useAddresses(user?.id || "");
  const createAddress = useCreateAddress();
  const { location, requestLocation, isLoading: locationLoading } = useLocation() as { location: UserLocation | null; requestLocation: () => void; isLoading: boolean };
  const [, setLocation] = useWouterLocation();
  
  const [activeTab, setActiveTab] = useState<'orders'|'addresses'|'profile'>('orders');
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  if (!isAuthenticated || authLoading) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    createAddress.mutate({
      userId: user.id,
      label: newAddress.label,
      address: newAddress.address,
      latitude: location?.latitude,
      longitude: location?.longitude,
      isDefault: (addresses?.length || 0) === 0
    }, {
      onSuccess: () => {
        setIsAddressOpen(false);
        setNewAddress({ label: '', address: '' });
      }
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Update localStorage with new profile data
    localStorage.setItem('user_name', `${profileData.firstName} ${profileData.lastName}`.trim());
    localStorage.setItem('user_phone', profileData.phone);
    
    // Update auth context if it has update method
    setIsProfileEditOpen(false);
  };

  const getStatusColor = (status: string | null) => {
    switch(status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-amber-100 text-amber-800';
      default: return 'bg-secondary/10 text-secondary';
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm mb-6 text-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-display text-2xl font-bold">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <h2 className="font-display font-semibold text-lg">{user?.firstName || 'User'}</h2>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>

            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-medium transition-all ${activeTab === 'orders' ? 'bg-secondary text-white shadow-md' : 'text-secondary hover:bg-secondary/5'}`}
            >
              <Package className="w-5 h-5" /> Order History
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-medium transition-all ${activeTab === 'addresses' ? 'bg-secondary text-white shadow-md' : 'text-secondary hover:bg-secondary/5'}`}
            >
              <MapPin className="w-5 h-5" /> Saved Addresses
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-medium transition-all ${activeTab === 'profile' ? 'bg-secondary text-white shadow-md' : 'text-secondary hover:bg-secondary/5'}`}
            >
              <Edit3 className="w-5 h-5" /> Edit Profile
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-display font-bold text-foreground">Edit Profile</h3>
                  <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
                    <DialogTrigger asChild>
                      <Button className="rounded-full bg-primary hover:bg-primary/90">
                        <Edit3 className="w-4 h-4 mr-2" /> Edit Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-[2rem] p-8">
                      <DialogHeader>
                        <DialogTitle className="font-display text-2xl mb-4">Edit Profile Information</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateProfile} className="space-y-5">
                        <div>
                          <label className="text-sm font-medium mb-2 block">First Name</label>
                          <Input 
                            required
                            value={profileData.firstName}
                            onChange={e => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                            className="rounded-xl"
                            placeholder="First Name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Last Name</label>
                          <Input 
                            value={profileData.lastName}
                            onChange={e => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                            className="rounded-xl"
                            placeholder="Last Name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Phone Number</label>
                          <Input 
                            required
                            value={profileData.phone}
                            onChange={e => setProfileData(prev => ({...prev, phone: e.target.value}))}
                            className="rounded-xl"
                            placeholder="Phone Number"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email</label>
                          <Input 
                            type="email"
                            value={profileData.email}
                            onChange={e => setProfileData(prev => ({...prev, email: e.target.value}))}
                            className="rounded-xl"
                            placeholder="Email"
                          />
                        </div>
                        <Button type="submit" className="w-full rounded-xl bg-secondary h-12 text-white">
                          <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-display text-2xl font-bold">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg text-gray-800">{user?.firstName || 'User'} {user?.lastName || ''}</h4>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <p className="text-sm text-gray-600">{user?.phone ? `+91 ${user.phone}` : 'No phone'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'orders' && (
                <h3 className="text-3xl font-display font-bold text-foreground mb-8">Order History</h3>
                
                {loadingOrders ? (
                  <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-border/50">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Order #{order.id}</div>
                            <div className="font-medium text-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" /> 
                              {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy • h:mm a') : 'Unknown date'}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-display font-bold text-xl text-foreground">${Number(order.totalAmount).toFixed(2)}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                              {order.status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-3 text-secondary">
                                <span className="font-medium w-6">{item.quantity}x</span>
                                <span>{item.product.name}</span>
                              </div>
                              <span className="text-muted-foreground">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-border/30 text-sm text-muted-foreground flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-border/50">
                    <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No orders yet</p>
                    <p className="text-muted-foreground">When you place orders, they will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-display font-bold text-foreground">Saved Addresses</h3>
                  <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
                    <DialogTrigger asChild>
                      <Button className="rounded-full bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" /> Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-[2rem] p-8">
                      <DialogHeader>
                        <DialogTitle className="font-display text-2xl mb-4">Add New Address</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddAddress} className="space-y-5">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Label (e.g., Home, Work)</label>
                          <Input 
                            required
                            value={newAddress.label}
                            onChange={e => setNewAddress(prev => ({...prev, label: e.target.value}))}
                            className="rounded-xl"
                            placeholder="Home"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Address</label>
                          <Textarea 
                            required
                            value={newAddress.address}
                            onChange={e => setNewAddress(prev => ({...prev, address: e.target.value}))}
                            className="rounded-xl resize-none"
                            rows={4}
                            placeholder="123 Organic St, Apt 4B..."
                          />
                        </div>
                        <Button type="submit" disabled={createAddress.isPending} className="w-full rounded-xl bg-secondary h-12 text-white">
                          {createAddress.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Address'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {addresses && addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {addresses.map((addr: any) => (
                      <div key={addr.id} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm relative group">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <h4 className="font-display font-semibold text-lg text-foreground mb-2">{addr.label}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{addr.full_address || addr.address}</p>
                        {addr.is_default && (
                          <span className="absolute top-6 right-6 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-border/50">
                    <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No addresses saved</p>
                    <p className="text-muted-foreground">Add an address to make checkout faster.</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
