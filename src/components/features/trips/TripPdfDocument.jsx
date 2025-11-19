import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "3pt solid #3B82F6",
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
  },
  metadata: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "bold",
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F2937",
    backgroundColor: "#F3F4F6",
    padding: 8,
    marginBottom: 12,
    borderRadius: 3,
    borderLeft: "4pt solid #3B82F6",
  },
  activityBox: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    marginBottom: 14,
    borderRadius: 5,
    border: "1.5pt solid #E5E7EB",
  },
  restaurantBox: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    marginBottom: 14,
    borderRadius: 5,
    border: "1.5pt solid #E5E7EB",
  },
  boxHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1pt solid #cbd5e1",
  },
  boxTitle: {
    fontSize: 13,
    fontWeight: "bold",
    flex: 1,
  },
  activityTitle: {
    color: "#3B82F6",
  },
  restaurantTitle: {
    color: "#3B82F6",
  },
  ratingBadge: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "bold",
    padding: "4 8",
    borderRadius: 3,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
    color: "#1F2937",
  },
  detailsGrid: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#6B7280",
    width: 70,
  },
  detailValue: {
    fontSize: 9,
    color: "#1F2937",
    flex: 1,
  },
  cuisineTag: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    fontSize: 8,
    padding: "3 6",
    borderRadius: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  cuisineContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#6B7280",
    borderTop: "1pt solid #E5E7EB",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 30,
    fontSize: 8,
    color: "#6B7280",
  },
  emptyState: {
    fontSize: 10,
    color: "#6B7280",
    fontStyle: "italic",
    marginTop: 4,
  },
});

export function TripPdfDocument({ trip }) {
  const cityName = trip.metadata?.cityName || trip.destination;
  const dateFrom = new Date(trip.dateFrom).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dateTo = new Date(trip.dateTo).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sortedDays = trip.finalPlan
    ? Object.entries(trip.finalPlan).sort(
        ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
      )
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reiseplan: {cityName}</Text>
          <Text style={styles.subtitle}>
            {dateFrom} - {dateTo}
          </Text>
          <Text style={styles.metadata}>
            {trip.travelers} {trip.travelers === 1 ? "reisende" : "reisende"} • {trip.metadata?.dayCount || 0} {trip.metadata?.dayCount === 1 ? "dag" : "dager"}
          </Text>
        </View>

        {/* Days */}
        {sortedDays.map(([dateKey, plan], index) => {
          const date = new Date(dateKey).toLocaleDateString("nb-NO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          // Handle both old and new data structures
          const attraction = plan.attractions?.[0] || plan.activity;
          const restaurant = plan.restaurants?.[0] || plan.restaurant;

          return (
            <View key={dateKey} style={styles.daySection} wrap={false}>
              <Text style={styles.dayHeader}>
                Dag {plan.dayNumber} • {date}
              </Text>

              {/* Activity/Attraction */}
              {attraction && (
                <View style={styles.activityBox}>
                  <View style={styles.boxHeader}>
                    <Text style={[styles.boxTitle, styles.activityTitle]}>
                      {attraction.name || "Ukjent aktivitet"}
                    </Text>
                    {attraction.rating && (
                      <Text style={styles.ratingBadge}>
                        ★ {attraction.rating}/5
                      </Text>
                    )}
                  </View>

                  {attraction.description && (
                    <Text style={styles.description}>
                      {attraction.description}
                    </Text>
                  )}

                  <View style={styles.detailsGrid}>
                    {attraction.address_obj?.address_string && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Adresse:</Text>
                        <Text style={styles.detailValue}>
                          {attraction.address_obj.address_string}
                        </Text>
                      </View>
                    )}

                    {attraction.phone && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Telefon:</Text>
                        <Text style={styles.detailValue}>
                          {attraction.phone}
                        </Text>
                      </View>
                    )}

                    {attraction.website && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Nettside:</Text>
                        <Text style={styles.detailValue}>
                          {attraction.website}
                        </Text>
                      </View>
                    )}

                    {attraction.web_url && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>TripAdvisor:</Text>
                        <Text style={styles.detailValue}>
                          {attraction.web_url}
                        </Text>
                      </View>
                    )}

                    {attraction.ranking_data?.ranking_string && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rangering:</Text>
                        <Text style={styles.detailValue}>
                          {attraction.ranking_data.ranking_string}
                        </Text>
                      </View>
                    )}

                    {attraction.num_reviews && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Anmeldelser:</Text>
                        <Text style={styles.detailValue}>
                          {attraction.num_reviews} anmeldelser
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Restaurant */}
              {restaurant && (
                <View style={styles.restaurantBox}>
                  <View style={styles.boxHeader}>
                    <Text style={[styles.boxTitle, styles.restaurantTitle]}>
                      {restaurant.name || "Ukjent restaurant"}
                    </Text>
                    {restaurant.rating && (
                      <Text style={styles.ratingBadge}>
                        ★ {restaurant.rating}/5
                      </Text>
                    )}
                  </View>

                  {restaurant.description && (
                    <Text style={styles.description}>
                      {restaurant.description}
                    </Text>
                  )}

                  {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Kjøkken:</Text>
                      <View style={styles.cuisineContainer}>
                        {restaurant.cuisine.map((c, idx) => (
                          <Text key={idx} style={styles.cuisineTag}>
                            {c.name || c.localized_name}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.detailsGrid}>
                    {restaurant.address_obj?.address_string && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Adresse:</Text>
                        <Text style={styles.detailValue}>
                          {restaurant.address_obj.address_string}
                        </Text>
                      </View>
                    )}

                    {restaurant.phone && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Telefon:</Text>
                        <Text style={styles.detailValue}>
                          {restaurant.phone}
                        </Text>
                      </View>
                    )}

                    {restaurant.website && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Nettside:</Text>
                        <Text style={styles.detailValue}>
                          {restaurant.website}
                        </Text>
                      </View>
                    )}

                    {restaurant.web_url && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>TripAdvisor:</Text>
                        <Text style={styles.detailValue}>
                          {restaurant.web_url}
                        </Text>
                      </View>
                    )}

                    {restaurant.price_level && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Prisnivå:</Text>
                        <Text style={styles.detailValue}>
                          {restaurant.price_level}
                        </Text>
                      </View>
                    )}

                    {restaurant.ranking_data?.ranking_string && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rangering:</Text>
                        <Text style={styles.detailValue}>
                          {restaurant.ranking_data.ranking_string}
                        </Text>
                      </View>
                    )}

                    {restaurant.num_reviews && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Anmeldelser:</Text>
                        <Text style={styles.detailValue}>
                          {restaurant.num_reviews} anmeldelser
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* Footer */}
        <Text style={styles.footer} fixed>
          Generert av ViaMundi • {new Date().toLocaleDateString("nb-NO", { 
            day: "numeric", 
            month: "long", 
            year: "numeric" 
          })}
        </Text>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Side ${pageNumber} av ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}
