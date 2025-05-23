import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getFavoriteShops, toggleFavorite } from "../utils/favoritesStorage";
import { useFocusEffect } from "@react-navigation/native";
import userAPI from "../services/userAPI";

const FAVORITE_CAFES = [
  {
    id: "1",
    name: "The Dreamer Coffee",
    address: "123 Đường Trần Hưng Đạo, Phường 10, Đà Lạt",
    rating: 4.8,
    reviews: 256,
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2947&auto=format&fit=crop",
    status: "open",
    distance: "0.8km",
  },
  {
    id: "2",
    name: "Mountain View Café",
    address: "45 Đường Lê Đại Hành, Đà Lạt",
    rating: 4.6,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=2940&auto=format&fit=crop",
    status: "busy",
    distance: "1.2km",
  },
  {
    id: "3",
    name: "Horizon Coffee",
    address: "78 Đường Nguyễn Chí Thanh, Đà Lạt",
    rating: 4.7,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2940&auto=format&fit=crop",
    status: "open",
    distance: "2.0km",
  },
];

const FAVORITE_DISHES = [
  {
    id: "1",
    name: "Cà phê sữa đá",
    price: "35.000đ",
    description: "Cà phê phin truyền thống với sữa đặc",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2787&auto=format&fit=crop",
    cafe: "The Dreamer Coffee",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: "2",
    name: "Cappuccino",
    price: "45.000đ",
    description: "Cà phê Ý với sữa tươi đánh bông",
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=2787&auto=format&fit=crop",
    cafe: "Mountain View Café",
    rating: 4.6,
    reviews: 85,
  },
];

export default function FavoritesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("cafes");
  const [shops, setShops] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchFavoriteShops();
    fetchFavoriteMenuItems();
  }, []);

  const fetchFavoriteShops = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await userAPI.HandleUser(`/favorite-shop?page=${page}&limit=${limit}`);
      setShops(response.data.data);
      console.log(response.data.data);
      setMetadata(response.data.data.metadata);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  const fetchFavoriteMenuItems = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await userAPI.HandleUser(`/favorite-product?page=${page}&limit=${limit}`);
      setMenuItems(response.data.data);
      setMetadata(response.data.data.metadata);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  const handleToggleFavorite = async (shop) => {
    await toggleFavorite(shop);
    fetchFavoriteShops(); // Reload favorites after toggling
  };

  const renderCafeCard = ({ item: cafe }) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => navigation.navigate("CafeDetail", { shopId: cafe._id })}
    >
      <Image
        source={{ uri: cafe.shopImages?.[0]?.url }}
        style={styles.cafeImage}
      />
      <View style={styles.cafeContent}>
        <View style={styles.cafeHeader}>
          <View>
            <Text style={styles.cafeName}>{cafe.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{cafe.rating_avg || 0}</Text>
              <Text style={styles.reviews}>({cafe.rating_count || 0} đánh giá)</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialCommunityIcons name="heart" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
        <View style={styles.cafeDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#64748B" />
            <Text style={styles.address}>{cafe.address}</Text>
          </View>
        </View>
        <View style={styles.cafeFooter}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: cafe.is_open ? "#4CAF50" : "#FF9800" },
            ]}
          >
            <Text style={styles.statusText}>
              {cafe.is_open ? "Đang mở cửa" : "Đóng cửa"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate("Booking", { shopId: cafe._id })}
          >
            <Text style={styles.bookButtonText}>Đặt chỗ</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDishCard = ({ item: dish }) => (
    <TouchableOpacity
      style={styles.dishCard}
      onPress={() => navigation.navigate("MenuItemDetail", { itemId: dish._id })}
    >
      <Image
        source={{ uri: dish.images?.[0]?.url }}
        style={styles.dishImage}
      />
      <View style={styles.dishContent}>
        <View style={styles.dishHeader}>
          <Text style={styles.dishName}>{dish.name}</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialCommunityIcons name="heart" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
        <Text style={styles.dishDescription} numberOfLines={2}>
          {dish.description}
        </Text>
        <View style={styles.dishInfo}>
          <Text style={styles.dishPrice}>
            {dish.price ? dish.price.toLocaleString() + "đ" : ""}
          </Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{dish.rating || 0}</Text>
            <Text style={styles.reviews}>({dish.reviews || 0})</Text>
          </View>
        </View>
        {dish.shop_id && (
          <TouchableOpacity style={styles.cafeBadge}>
            <MaterialCommunityIcons name="store" size={16} color="#4A90E2" />
            <Text style={styles.cafeName}>{dish.shop_id.name || ""}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.title}>Yêu thích</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "cafes" && styles.activeTab]}
          onPress={() => setActiveTab("cafes")}
        >
          <MaterialCommunityIcons
            name="store"
            size={20}
            color={activeTab === "cafes" ? "#4A90E2" : "#64748B"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "cafes" && styles.activeTabText,
            ]}
          >
            Quán yêu thích
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "dishes" && styles.activeTab]}
          onPress={() => setActiveTab("dishes")}
        >
          <MaterialCommunityIcons
            name="food"
            size={20}
            color={activeTab === "dishes" ? "#4A90E2" : "#64748B"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "dishes" && styles.activeTabText,
            ]}
          >
            Món yêu thích
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "cafes"
        ? <FlatList
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            data={shops}
            keyExtractor={item => item._id}
            renderItem={renderCafeCard}
          />
        : <FlatList
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            data={menuItems}
            keyExtractor={item => item._id}
            renderItem={renderDishCard}
          />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAF9",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeTab: {
    backgroundColor: "#E0ECFF",
    borderColor: "#4A90E2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: { 
    color: "#1D4ED8", 
    fontWeight: "700" 
  },
  shopCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  cafeImage: {
    width: "100%",
    height: 200,
  },
  cafeContent: {
    padding: 16,
    gap: 16,
  },
  cafeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cafeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#854D0E",
  },
  reviews: {
    fontSize: 12,
    color: "#854D0E",
  },
  favoriteButton: {
    padding: 10,
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  cafeDetails: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  address: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
    lineHeight: 20,
  },
  cafeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  bookButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  dishCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dishImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  dishContent: {
    padding: 16,
    gap: 14,
  },
  dishHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dishName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    letterSpacing: 0.3,
  },
  dishDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  dishInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    letterSpacing: 0.3,
  },
  cafeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
});
