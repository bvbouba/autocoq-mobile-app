import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors, Divider, fonts } from "../Themed";
import { useModal } from "@/context/useModal";
import ReviewForm from "./ReviewForm";
import { ProductFragment, useReviewListQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { StarRating } from "@/utils/starRating";


const RatingBar = ({ stars, count, total }: { stars: number; count: number; total: number }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <View style={styles.ratingBarRow}>
      <Text style={styles.starLabel}>{stars}★</Text>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.reviewCount}>{count}</Text>
    </View>
  );
};

const Review = ({ product }: { product: ProductFragment }) => {
  const { openModal } = useModal();
  const { data, refetch } = useReviewListQuery({ variables: { filter: { product: product.id } } });

  const reviews = mapEdgesToItems(data?.reviews);
  // Total Reviews & Star Counts
  const totalReviews = product.reviewCount || 0;
  const starCounts = {
    5: product.reviews5Stars || 0,
    4: product.reviews4Stars || 0,
    3: product.reviews3Stars || 0,
    2: product.reviews2Stars || 0,
    1: product.reviews1Star || 0,
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.row}>
        <View style={styles.header}>
          <Text style={styles.title}>Avis</Text>
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() =>
              openModal({
                id: "Review",
                content: <ReviewForm product={product} refetchReviews={refetch} />,
                height: "100%",
                marginTop: 0,
                closeButtonVisible: true,
                disableScroll: true,
              })
            }
          >
            <Text style={styles.reviewButtonText}>ÉCRIRE UN AVIS</Text>
          </TouchableOpacity>
        </View>

        {/* Overall Rating */}
        <View style={styles.ratingSection}>
          <StarRating rating={Math.round(Number(product.averageRating))} />
          <Text style={styles.ratingText}>
            <Text>{product.averageRating}<Text style={{color:colors.border}}>{"  |  "}</Text></Text>
            <Text style={{ textDecorationLine: "underline" }}>
              {product.reviewCount} Avis
            </Text>
          </Text>
        </View>
      </View>
       
      {(reviews && reviews.length >0) &&
        <>
      <Divider style={{ borderBottomWidth: 10 }} />

      {/* ⭐ Rating Snapshot */}
      <View style={styles.ratingSnapshot}>
        <Text style={styles.snapshotTitle}>Évaluation globale</Text>
        {Object.entries(starCounts)
          .sort(([a], [b]) => Number(b) - Number(a)) // Sort in descending order
          .map(([stars, count]) => (
            <RatingBar key={stars} stars={Number(stars)} count={count} total={totalReviews} />
          ))}
      </View>

      {/* List of Reviews */}
        <Divider style={{ borderBottomWidth: 10 }} />

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const timeAgo = item.created
            ? formatDistanceToNow(parseISO(item.created), { addSuffix: true, locale: fr })
            : "Date inconnue";

          return (
            <View style={styles.reviewItem}>
              <View style={{
                flexDirection:"row",
                justifyContent:"space-between"
              }}><StarRating rating={item.rating} /> 
              {/* Verified Purchaser Tag */}
                  <View style={styles.verifiedContainer}>
                  {item.isVerified && (<>
                    <FontAwesome name="gg-circle" size={14} color={colors.primary} style={styles.verifiedIcon} />
                    <Text style={styles.verifiedText}>Acheteur Vérifié</Text>
                    </>
                  )}
                  </View>
              
              </View>
              <Text style={styles.reviewer}>
                {item.firstname} • {timeAgo}
              </Text>
              <Text style={styles.reviewContent}>{item.content}</Text>
            </View>
          );
        }}
        scrollEnabled={false}
        nestedScrollEnabled={true}
      />
      </>
      }
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom:20
  },
  row: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: fonts.h1,
    fontWeight: "bold",
  },
  reviewButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  reviewButtonText: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  starContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: fonts.caption,
    fontWeight: "500",
  },
  ratingSnapshot: {
    padding: 15,
  },
  snapshotTitle: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  starLabel: {
    width: 30,
    fontSize: fonts.caption,
    fontWeight: "bold",
    color:colors.textSecondary
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  reviewCount: {
    width: 40,
    color:colors.textSecondary,
    textAlign: "right",
    fontSize: fonts.caption,
    fontWeight: "bold",
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  reviewer: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  reviewContent: {
    fontSize: fonts.body,
    marginTop: 5,
    color: colors.textPrimary,
  },
  carSection: {
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  carTitle: {
    fontWeight: "bold",
    color: colors.textPrimary,
    fontSize: 14,
  },
  carName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  verifiedIcon: {
    marginRight: 5,
  },
  verifiedText: {
    fontSize: fonts.caption,
  },
});

export default Review;
