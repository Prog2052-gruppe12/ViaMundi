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

          return (
            <View key={dateKey} style={styles.daySection} wrap={false}>
              <Text style={styles.dayHeader}>
                Dag {plan.dayNumber} • {date}
              </Text>

              {/* Activity */}
              {plan.activity?.info && (
                <View style={styles.activityBox}>
                  <View style={styles.boxHeader}>
                    <Text style={[styles.boxTitle, styles.activityTitle]}>
                      {plan.activity.info.name || "Ukjent aktivitet"}
                    </Text>
                    {plan.activity.info.rating && (
                      <Text style={styles.ratingBadge}>
                        ★ {plan.activity.info.rating}/5
                      </Text>
                    )}
                  </View>

                  {plan.activity.info.description && (
                    <Text style={styles.description}>
                      {plan.activity.info.description}
                    </Text>
                  )}

                  <View style={styles.detailsGrid}>
                    {plan.activity.info.address && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Adresse:</Text>
                        <Text style={styles.detailValue}>
                          {plan.activity.info.address}
                        </Text>
                      </View>
                    )}

                    {plan.activity.info.phone && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Telefon:</Text>
                        <Text style={styles.detailValue}>
                          {plan.activity.info.phone}
                        </Text>
                      </View>
                    )}

                    {plan.activity.info.website && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Nettside:</Text>
                        <Text style={styles.detailValue}>
                          {plan.activity.info.website}
                        </Text>
                      </View>
                    )}

                    {plan.activity.info.web_url && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>TripAdvisor:</Text>
                        <Text style={styles.detailValue}>
                          {plan.activity.info.web_url}
                        </Text>
                      </View>
                    )}

                    {plan.activity.info.ranking && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rangering:</Text>
                        <Text style={styles.detailValue}>
                          {plan.activity.info.ranking}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Restaurant */}
              {plan.restaurant?.info && (
                <View style={styles.restaurantBox}>
                  <View style={styles.boxHeader}>
                    <Text style={[styles.boxTitle, styles.restaurantTitle]}>
                      {plan.restaurant.info.name || "Ukjent restaurant"}
                    </Text>
                    {plan.restaurant.info.rating && (
                      <Text style={styles.ratingBadge}>
                        ★ {plan.restaurant.info.rating}/5
                      </Text>
                    )}
                  </View>

                  {plan.restaurant.info.description && (
                    <Text style={styles.description}>
                      {plan.restaurant.info.description}
                    </Text>
                  )}

                  {plan.restaurant.info.cuisine && plan.restaurant.info.cuisine.length > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Kjøkken:</Text>
                      <View style={styles.cuisineContainer}>
                        {plan.restaurant.info.cuisine.map((c, idx) => (
                          <Text key={idx} style={styles.cuisineTag}>
                            {c.name}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.detailsGrid}>
                    {plan.restaurant.info.address && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Adresse:</Text>
                        <Text style={styles.detailValue}>
                          {plan.restaurant.info.address}
                        </Text>
                      </View>
                    )}

                    {plan.restaurant.info.phone && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Telefon:</Text>
                        <Text style={styles.detailValue}>
                          {plan.restaurant.info.phone}
                        </Text>
                      </View>
                    )}

                    {plan.restaurant.info.website && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Nettside:</Text>
                        <Text style={styles.detailValue}>
                          {plan.restaurant.info.website}
                        </Text>
                      </View>
                    )}

                    {plan.restaurant.info.web_url && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>TripAdvisor:</Text>
                        <Text style={styles.detailValue}>
                          {plan.restaurant.info.web_url}
                        </Text>
                      </View>
                    )}

                    {plan.restaurant.info.price_level && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Prisnivå:</Text>
                        <Text style={styles.detailValue}>
                          {plan.restaurant.info.price_level}
                        </Text>
                      </View>
                    )}

                    {plan.restaurant.info.ranking && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rangering:</Text>
                        <Text style={styles.detailValue}>
                          {plan.restaurant.info.ranking}
                        </Text>
                      </View>
                    )}

                    {plan.restaurant.info.num_reviews && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Anmeldelser:</Text>
                        <Text style={styles.detailValue}>
                          {plan.restaurant.info.num_reviews} anmeldelser
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
