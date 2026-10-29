import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function DetailsScreen({ route }) {
  const { id, name } = route.params;
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEpisodes() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar episódios (${response.status})`);
        }
        const data = await response.json();
        setEpisodes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os episódios.');
      } finally {
        setLoading(false);
      }
    }

    loadEpisodes();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.statusText}>Carregando episódios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name || 'Série'}</Text>
      <FlatList
        data={episodes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.statusText}>Nenhum episódio encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.episodeCard}>
            <View style={styles.seasonBadge}>
              <Text style={styles.seasonText}>T{item.season ?? '?'} E{item.number ?? '?'}</Text>
            </View>
            <Text style={styles.episodeName}>{item.name || 'Nome indisponível'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  statusText: { marginTop: 12, color: '#4b5563', textAlign: 'center' },
  errorText: { color: '#b91c1c', textAlign: 'center', fontSize: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', padding: 16, backgroundColor: '#fff' },
  list: { padding: 12 },
  episodeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10,
    padding: 12, marginBottom: 9, elevation: 1,
  },
  seasonBadge: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 9 },
  seasonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  episodeName: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#1f2937' },
});