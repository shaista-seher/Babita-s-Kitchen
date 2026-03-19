import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  const products = [
    { id: 1, name: 'Crispy Papad', price: '₹20' },
    { id: 2, name: 'Mango Pickle', price: '₹50' },
  ];

  return (
    <View className="flex-1 p-4 bg-[#F8F4EC]">
      <View className="flex-row justify-between items-center mb-6">
{user ? `, ${user.phone}` : ''}
{user &amp;&amp; (
          <Button title="Logout" onPress={signOut} className="bg-red-500" />
        )}
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
            <Text className="font-semibold text-lg">{item.name}</Text>
            <Text className="text-amber-600 font-bold">{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

